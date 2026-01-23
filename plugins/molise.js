import axios from 'axios'
import fs from 'fs'
import path from 'path'

const authorizedJid ='393755649556@s.whatsapp.net' // Metti qui il JID autorizzato

function normalize(str) {
  if (!str) return ''
  str = str
    .split(/\s*[\(\[{](?:feat|ft|featuring).*$/i)[0]
    .split(/\s*(?:feat|ft|featuring)\.?\s+.*$/i)[0]
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

const vicArtists = [
  "thasup","thasupreme","Thasup","Thasupreme"
]

async function getRandomVicTrack() {
  let found = null, attempts = 0
  while (!found && attempts < 5) {
    const keyword = vicArtists[Math.floor(Math.random() * vicArtists.length)]
    const res = await axios.get('https://itunes.apple.com/search', {
      params: { term: keyword, country: 'IT', media: 'music', limit: 20 }
    })
    const valid = res.data.results.filter(t => t.previewUrl && t.trackName && t.artistName)
    if (valid.length) found = valid[Math.floor(Math.random() * valid.length)]
    attempts++
  }
  if (!found) throw new Error('Nessuna canzone trovata')
  return {
    title: found.trackName,
    artist: found.artistName,
    preview: found.previewUrl
  }
}

const activeVicGames = new Map()

const handler = async (m, { conn }) => {
  const chat = m.chat
  const sender = m.sender

  if (sender !== authorizedJid) {
    return m.reply('🚫 Non sei autorizzato a usare questo comando.')
  }

  if (activeVicGames.has(chat)) {
    return m.reply('🎮 C\'è già una partita in corso in questo gruppo.')
  }

  try {
    const track = await getRandomVicTrack()
    const audioResponse = await axios.get(track.preview, { responseType: 'arraybuffer' })

    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    const audioPath = path.join(tmpDir, `vic_${Date.now()}.mp3`)
    fs.writeFileSync(audioPath, Buffer.from(audioResponse.data))

    const audioMsg = await conn.sendMessage(chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })

    fs.unlinkSync(audioPath)

    const formatMsg = (sec) => `
╭─🎤 *INDOVINA LA CANZONE* ─╮
│ ⏱ Tempo rimasto: *${sec}s*
│ 👤 Artista: *${track.artist}*
│ 💭 Rispondi con il titolo!
╰───────────────────────────╯`.trim()

    const gameMsg = await conn.reply(chat, formatMsg(30), m)

    const game = {
      track,
      timeLeft: 30,
      message: gameMsg,
      audioMessage: audioMsg,
      interval: null
    }

    game.interval = setInterval(async () => {
      game.timeLeft -= 5
      if (game.timeLeft <= 0) {
        clearInterval(game.interval)
        activeVicGames.delete(chat)

        // elimina messaggio gioco
        await conn.sendMessage(chat, { delete: game.message.key }).catch(() => {})
        // mostra risultato e bottone per rigiocare
        await conn.sendMessage(chat, {
          text: `
⏰ *Tempo scaduto!*
🎵 Titolo: *${track.title}*
👤 Artista: *${track.artist}*`,
          buttons: [{ buttonId: '.molise', buttonText: { displayText: '🔁 Rigioca' }, type: 1 }],
          headerType: 1
        })
      } else {
        // aggiorna messaggio con tempo rimanente
        await conn.sendMessage(chat, {
          text: formatMsg(game.timeLeft),
          edit: game.message.key
        }).catch(() => {})
      }
    }, 5000)

    activeVicGames.set(chat, game)

  } catch (e) {
    console.error('[.vic] Errore:', e)
    m.reply('⚠️ Errore nel gioco .vic. Riprova più tardi.')
    activeVicGames.delete(chat)
  }
}

handler.before = async (m, { conn }) => {
  const chat = m.chat
  if (!activeVicGames.has(chat)) return

  const game = activeVicGames.get(chat)
  const quotedId = m.quoted?.key?.id || m.quoted?.id
  if (!quotedId) return

  // Controlla se il messaggio è risposta al gioco (testo o audio)
  const isReply = quotedId === game.message?.key?.id || quotedId === game.audioMessage?.key?.id
  if (!isReply) return

  const userAnswer = normalize(m.text || '')
  const correctAnswer = normalize(game.track.title)
  if (!userAnswer || userAnswer.length < 2) return

  // Similarity semplice
  const similarity = (a, b) => {
    const wordsA = a.split(' ')
    const wordsB = b.split(' ')
    const matches = wordsA.filter(w1 => wordsB.some(w2 => w2.includes(w1) || w1.includes(w2)))
    return matches.length / Math.max(wordsA.length, wordsB.length)
  }

  const score = similarity(userAnswer, correctAnswer)
  const isCorrect =
    userAnswer === correctAnswer ||
    (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length * 0.5) ||
    (userAnswer.includes(correctAnswer) && userAnswer.length < correctAnswer.length * 1.5) ||
    score >= 0.7

  if (isCorrect) {
    clearInterval(game.interval)
    activeVicGames.delete(chat)

    await conn.sendMessage(chat, {
      react: { text: '✅', key: m.key }
    }).catch(() => {})

    await conn.sendMessage(chat, { delete: game.message.key }).catch(() => {})

    await conn.sendMessage(chat, {
      text: `
🎉 *Hai indovinato!*
🎵 Titolo: *${game.track.title}*
👤 Artista: *${game.track.artist}*`,
      buttons: [{ buttonId: '.vic', buttonText: { displayText: '🎧 Rigioca' }, type: 1 }],
      headerType: 1
    }, { quoted: m })

  } else if (score >= 0.3) {
    await conn.sendMessage(chat, { react: { text: '❌', key: m.key } }).catch(() => {})
    await conn.reply(chat, '⏳ *Ci sei quasi!* Riprova.', m)
  } else {
    await conn.sendMessage(chat, { react: { text: '❌', key: m.key } }).catch(() => {})
    await conn.reply(chat, '❌ *Risposta sbagliata!* Riascolta meglio.', m)
  }
}

handler.help = ['molise']
handler.tags = ['giochi']
handler.command = ['molise']

export default handler