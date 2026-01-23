import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path' 
import { fileURLToPath } from 'url'
import yts from 'yt-search'
import axios from 'axios'
import youtubedl from 'youtube-dl-exec'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')
const LIKES_FILE = path.join(__dirname, '..', 'track_likes.json')

// Inizializza i file se non esistono
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '{}', 'utf8')
}

if (!fs.existsSync(LIKES_FILE)) {
  fs.writeFileSync(LIKES_FILE, '{}', 'utf8')
}

// Cache per le richieste API
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000

// Directory temporanea per i download
const tmpDir = path.join(process.cwd(), 'temp')
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

function loadLikes() {
  return JSON.parse(fs.readFileSync(LIKES_FILE, 'utf8'))
}

function saveLikes(likes) {
  fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2), 'utf8')
}

function getLastfmUsername(userId) {
  const users = loadUsers()
  return users[userId] || null
}

function setLastfmUsername(userId, username) {
  const users = loadUsers()
  users[userId] = username
  saveUsers(users)
}

function getTrackId(track) {
  return `${track.artist['#text']}-${track.name}`.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getLikes(trackId) {
  const likes = loadLikes()
  return likes[trackId] || { count: 0, users: [] }
}

function addLike(trackId, userId) {
  const likes = loadLikes()
  if (!likes[trackId]) {
    likes[trackId] = { count: 0, users: [] }
  }
  
  const userIndex = likes[trackId].users.indexOf(userId)
  if (userIndex !== -1) {
    likes[trackId].users.splice(userIndex, 1)
    likes[trackId].count--
  } else {
    likes[trackId].users.push(userId)
    likes[trackId].count++
  }
  
  saveLikes(likes)
  return likes[trackId]
}

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

// === FUNZIONE PER DOWNLOAD AUDIO ===
async function downloadAudio(query) {
  try {
    // Cerca il video su YouTube
    const search = await yts(query)
    if (!search.videos.length) throw new Error('Nessun risultato trovato su YouTube')
    
    const videoInfo = search.videos[0]
    
    // Configurazione youtube-dl-exec
    const ytdlOptions = {
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: false,
      socketTimeout: 30,
      retries: 5,
      forceIpv4: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      concurrentFragments: 10,
      noPlaylist: true,
      format: 'bestaudio/best',
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0
    }

    // Crea file temporaneo
    const tmpFile = path.join(tmpDir, `cur_download_${Date.now()}.mp3`)
    ytdlOptions.output = tmpFile

    // Download con youtube-dl-exec
    await youtubedl(videoInfo.url, ytdlOptions)

    // Leggi il file in buffer
    const buffer = await fs.promises.readFile(tmpFile)
    
    // Pulisci file temporaneo
    await fs.promises.unlink(tmpFile).catch(() => {})

    return {
      title: videoInfo.title,
      buffer: buffer,
      url: videoInfo.url,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.timestamp,
      author: videoInfo.author?.name
    }
  } catch (error) {
    console.error('Errore nel download audio:', error)
    throw error
  }
}

async function fetchWithCache(url) {
  const now = Date.now()
  const cached = cache.get(url)
  
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data
  }
  
  try {
    const res = await fetch(url)
    const json = await res.json()
    
    cache.set(url, {
      data: json,
      timestamp: now
    })
    
    return json
  } catch (error) {
    console.error('Errore nella richiesta API:', error)
    throw error
  }
}

async function getRecentTrack(username) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const json = await fetchWithCache(url)
  return json?.recenttracks?.track?.[0]
}

async function getRecentTracks(username, limit = 10) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`
  const json = await fetchWithCache(url)
  return json?.recenttracks?.track || []
}

async function getTopArtists(username, period = '7day', limit = 9) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`
  const json = await fetchWithCache(url)
  return json?.topartists?.artist
}

async function getTopAlbums(username, period = '7day', limit = 9) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`
  const json = await fetchWithCache(url)
  return json?.topalbums?.album
}

async function getTopTracks(username, period = '7day', limit = 9) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`
  const json = await fetchWithCache(url)
  return json?.toptracks?.track
}

async function getSpotifyCover(artist, track) {
  try {
    const searchUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`
    const trackInfo = await fetchWithCache(searchUrl)
    
    if (trackInfo?.track?.album?.image?.[2]?.['#text']) {
      return trackInfo.track.album.image[2]['#text']
    }
    
    const artistUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_API_KEY}&format=json`
    const artistInfo = await fetchWithCache(artistUrl)
    
    if (artistInfo?.artist?.image?.[2]?.['#text']) {
      return artistInfo.artist.image[2]['#text']
    }
    
    return null
  } catch (error) {
    console.error('Errore nel recupero cover Spotify:', error)
    return null
  }
}

const handler = async (m, { conn, args, usedPrefix, text, command }) => {
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      await conn.sendMessage(m.chat, {
        text: `❌ Usa il comando così: ${usedPrefix}setuser <username>`
      })
      return
    }

    setLastfmUsername(m.sender, username)
    await conn.sendMessage(m.chat, {
      text: `✅ Username *${username}* salvato!`
    })
    return
  }

  if (command === 'like') {
    const user = getLastfmUsername(m.sender)
    if (!user) {
      await conn.sendMessage(m.chat, {
        text: `🎵 *Registrazione Last.fm richiesta*\n\n@${m.sender.split('@')[0]}, per usare i comandi musicali devi registrare il tuo username Last.fm.\n\n📱 *Usa questo comando:*\n${usedPrefix}setuser <tuo_username>`,
        mentions: [m.sender]
      })
      return
    }

    const track = await getRecentTrack(user)
    if (!track) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna traccia trovata.' })
    }

    const trackId = getTrackId(track)
    const likes = addLike(trackId, m.sender)
    
    const heartIcon = likes.users.includes(m.sender) ? '❤️' : '🤍'
    
    await conn.sendMessage(m.chat, {
      text: `${heartIcon} *Like aggiunto!*\n\n🎵 ${track.name} - ${track.artist['#text']}\n\n❤️ ${likes.count} like totali`
    })
    return
  }

  // === COMANDO PER SCARICARE LA CANZONE IN RIPRODUZIONE ===
  if (command === 'cur_download') {
    const user = getLastfmUsername(m.sender)
    if (!user) {
      await conn.sendMessage(m.chat, {
        text: `🎵 *Registrazione Last.fm richiesta*\n\n@${m.sender.split('@')[0]}, per usare i comandi musicali devi registrare il tuo username Last.fm.\n\n📱 *Usa questo comando:*\n${usedPrefix}setuser <tuo_username>`,
        mentions: [m.sender]
      })
      return
    }

    const track = await getRecentTrack(user)
    if (!track) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna traccia in riproduzione trovata.' })
    }

    const artist = track.artist?.['#text'] || 'Artista sconosciuto'
    const title = track.name || 'Brano sconosciuto'
    const searchQuery = `${artist} - ${title}`

    try {
      await conn.sendMessage(m.chat, { 
        text: `⏳ *Sto scaricando:*\n🎵 ${title}\n🎤 ${artist}` 
      }, { quoted: m })

      const audio = await downloadAudio(searchQuery)
      
      await conn.sendMessage(m.chat, {
        audio: audio.buffer,
        mimetype: 'audio/mpeg',
        fileName: `${audio.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: `🎵 ${title}`,
            body: `🎤 ${artist} | 222 BOT`,
            thumbnailUrl: audio.thumbnail,
            mediaType: 2,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m })
      
    } catch (error) {
      await conn.sendMessage(m.chat, { 
        text: `❌ Errore nel download: ${error.message}\n\nProva con: ${usedPrefix}play "${searchQuery}"` 
      })
    }
    return
  }

  const user = getLastfmUsername(m.sender)
  if (!user) {
    await conn.sendMessage(m.chat, {
      text: `🎵 *Registrazione Last.fm richiesta*\n\n@${m.sender.split('@')[0]}, per usare i comandi musicali devi registrare il tuo username Last.fm.\n\n📱 *Usa questo comando:*\n${usedPrefix}setuser <tuo_username>`,
      mentions: [m.sender]
    })
    return
  }

  if (command === 'cur') {
    const track = await getRecentTrack(user)
    if (!track) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna traccia trovata.' })
    }

    const trackId = getTrackId(track)
    const likes = getLikes(trackId)
    const userLiked = likes.users.includes(m.sender)
    const heartIcon = userLiked ? '❤️' : '🤍'

    const nowPlaying = track['@attr']?.nowplaying === 'true'
    const artist = track.artist?.['#text'] || 'Artista sconosciuto'
    const title = track.name || 'Brano sconosciuto'
    const album = track.album?.['#text'] || 'Album sconosciuto'
    
    let image = track.image?.find(img => img.size === 'extralarge')?.['#text'] || null
    
    if (!image || image.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
      const spotifyImage = await getSpotifyCover(artist, title)
      if (spotifyImage) {
        image = spotifyImage
      }
    }

    const caption = nowPlaying
      ? `🎧 *IN RIPRODUZIONE* da @${m.sender.split('@')[0]}\n\n🎵 *${title}*\n🎤 ${artist}\n💿 ${album}\n\n${heartIcon} ${likes.count} like`
      : `⏹️ *ULTIMO BRANO* di @${m.sender.split('@')[0]}\n\n🎵 *${title}*\n🎤 ${artist}\n💿 ${album}\n\n${heartIcon} ${likes.count} like`

    // PULSANTI AGGIORNATI CON DOWNLOAD
    const buttons = [
      { buttonId: `${usedPrefix}cur_download`, buttonText: { displayText: '⬇️ Scarica Audio' }, type: 1 },
      { buttonId: `${usedPrefix}topartists`, buttonText: { displayText: '🎨 Top Artisti' }, type: 1 },
      { buttonId: `${usedPrefix}topalbums`, buttonText: { displayText: '💿 Top Album' }, type: 1 },
      { buttonId: `${usedPrefix}toptracks`, buttonText: { displayText: '🎵 Top Brani' }, type: 1 }
    ]

    const buttonMessage = {
      text: caption,
      footer: 'Scarica la canzone o scopri le tue statistiche:',
      buttons: buttons,
      headerType: 1,
      mentions: [m.sender]
    }

    if (image) {
      buttonMessage.image = { url: image }
      buttonMessage.caption = caption
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    return
  }

  // COMANDI TOP CON PULSANTI
  if (command === 'topartists' || command === 'topalbums' || command === 'toptracks') {
    const { size, period } = parseOptions(text)
    
    let data, title, emoji
    switch (command) {
      case 'topartists':
        data = await getTopArtists(user, period, size * size)
        title = 'artisti'
        emoji = '🎨'
        break
      case 'topalbums':
        data = await getTopAlbums(user, period, size * size)
        title = 'album'
        emoji = '💿'
        break
      case 'toptracks':
        data = await getTopTracks(user, period, size * size)
        title = 'brani'
        emoji = '🎵'
        break
    }

    if (!data?.length) {
      return conn.sendMessage(m.chat, { text: `❌ Nessun ${title.slice(0, -1)} trovato.` })
    }

    const list = data.map((item, i) => {
      if (command === 'topartists') {
        return `${i + 1}. *${item.name}* (${item.playcount} play)`
      } else if (command === 'topalbums') {
        return `${i + 1}. *${item.name}* – ${item.artist?.name || 'Sconosciuto'} (${item.playcount} play)`
      } else {
        return `${i + 1}. *${item.name}* – ${item.artist?.name || 'Sconosciuto'} (${item.playcount} play)`
      }
    }).join('\n')

    // PULSANTI PER NAVIGAZIONE
    const topButtons = [
      { buttonId: `${usedPrefix}cur_download`, buttonText: { displayText: '⬇️ Scarica Audio' }, type: 1 },
      { buttonId: `${usedPrefix}topartists`, buttonText: { displayText: '🎨 Artisti' }, type: 1 },
      { buttonId: `${usedPrefix}topalbums`, buttonText: { displayText: '💿 Album' }, type: 1 },
      { buttonId: `${usedPrefix}cur`, buttonText: { displayText: '↩️ Torna a Cur' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      text: `${emoji} *Top ${data.length} ${title} di ${user}* (${period})\n\n${list}`,
      footer: 'Naviga tra le tue statistiche:',
      buttons: topButtons
    }, { quoted: m })
    return
  }

  if (command === 'cronologia') {
    const tracks = await getRecentTracks(user, 10)
    if (!tracks.length) {
      return conn.sendMessage(m.chat, { text: '❌ Nessuna cronologia trovata.' })
    }

    const trackList = tracks.map((track, i) => {
      const icon = track['@attr']?.nowplaying === 'true' ? '▶️' : `${i + 1}.`
      return `${icon} ${track.name}\n   🎤 ${track.artist['#text']}`
    }).join('\n\n')

    // Aggiungi pulsante download anche nella cronologia
    const cronologiaButtons = [
      { buttonId: `${usedPrefix}cur_download`, buttonText: { displayText: '⬇️ Scarica Ultima' }, type: 1 },
      { buttonId: `${usedPrefix}cur`, buttonText: { displayText: '🎧 Traccia Corrente' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
      text: `📜 *Cronologia ascolti di ${user}*\n\n${trackList}`,
      footer: 'Scarica l\'ultima traccia ascoltata:',
      buttons: cronologiaButtons
    })
    return
  }
}

function parseOptions(text) {
  let size = 3
  let period = '7day'
  
  const sizeMatch = text.match(/(\d)x\1/)
  if (sizeMatch) size = parseInt(sizeMatch[1])
  
  const periodMatch = text.match(/(1w|7day|1m|1month|3m|3month|6m|6month|1y|12month|overall)/i)
  if (periodMatch) {
    const periodStr = periodMatch[1].toLowerCase()
    const periodMap = {
      '1w': '7day', '7day': '7day',
      '1m': '1month', '1month': '1month',
      '3m': '3month', '3month': '3month',
      '6m': '6month', '6month': '6month',
      '1y': '12month', '12month': '12month',
      'overall': 'overall'
    }
    period = periodMap[periodStr] || '7day'
  }
  
  return { size, period }
}

handler.command = ['setuser', 'cur', 'topartists', 'topalbums', 'toptracks', 'cronologia', 'like', 'cur_download']
handler.group = true

export default handler