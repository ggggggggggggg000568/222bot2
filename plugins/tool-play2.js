import youtubedl from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import ytSearch from 'yt-search';

const tmpDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

async function downloadWithYtDlExec(url, options = {}) {
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
  };

  if (options.output) ytdlOptions.output = options.output;
  return await youtubedl(url, ytdlOptions);
}

async function searchYoutubeMultiple(query) {
  const search = await ytSearch(query);
  return search.videos.slice(0, 5) || [];
}

async function downloadAudioFromUrl(url) {
  try {
    const tmpFile = path.join(tmpDir, `play2_${Date.now()}.mp3`);
    await downloadWithYtDlExec(url, { output: tmpFile });

    const buffer = await fs.promises.readFile(tmpFile);
    await fs.promises.unlink(tmpFile).catch(() => {});

    return buffer;
  } catch (error) {
    throw error;
  }
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'play2') {
    if (!text?.trim()) {
      return await conn.sendMessage(m.chat, { 
        text: `🎵 *COMANDO PLAY2 - RICERCA AVANZATA*\n\nInserisci il nome del brano:\nEsempio: ${usedPrefix}play2 "Daft Punk - Get Lucky"` 
      }, { quoted: m });
    }

    const videos = await searchYoutubeMultiple(text);
    if (!videos.length) return m.reply('❌ Nessun risultato trovato.');

    // Crea cards per i risultati
    const musicCards = videos.map((video, index) => ({
      image: { url: video.thumbnail },
      title: `🎵 ${index + 1}. ${video.title.substring(0, 55)}${video.title.length > 55 ? '...' : ''}`,
      body: `⏱️ ${video.timestamp} | 👁️ ${video.views.toLocaleString()}\n🎤 ${video.author?.name || 'Sconosciuto'}`,
      footer: `Risultato ${index + 1} di ${videos.length}`
    }));

    await conn.sendMessage(m.chat, {
      text: `🔍 *RISULTATI PER:* "${text}"`,
      title: '🎧 Music Search - 222 BOT',
      footer: 'Seleziona un brano dai pulsanti qui sotto',
      cards: musicCards
    }, { quoted: m });

    // Pulsanti per selezione
    const buttons = videos.map((video, index) => ({
      buttonId: `${usedPrefix}playformat ${index + 1}`,
      buttonText: { displayText: `🎵 ${index + 1}` },
      type: 1
    }));

    await conn.sendMessage(m.chat, {
      text: '🔢 *SELEZIONA UN BRANO:*',
      footer: 'Clicca sul numero corrispondente al brano scelto',
      buttons: buttons,
      headerType: 1
    }, { quoted: m });

    // Salva in cache
    conn.musicCache = conn.musicCache || {};
    conn.musicCache[m.sender] = videos;

  } else if (command === 'playformat') {
    if (!conn.musicCache?.[m.sender]) {
      return m.reply('❌ Nessuna ricerca in cache. Usa prima .play2 <nome brano>');
    }

    const index = parseInt(text) - 1;
    const videos = conn.musicCache[m.sender];

    if (isNaN(index) || index < 0 || index >= videos.length) {
      return m.reply(`❌ Inserisci un numero tra 1 e ${videos.length}`);
    }

    const selected = videos[index];
    
    try {
      await conn.sendMessage(m.chat, { 
        text: `⏳ *Scarico:*\n🎵 ${selected.title}\n🎤 ${selected.author?.name || 'Sconosciuto'}` 
      }, { quoted: m });

      const audioBuffer = await downloadAudioFromUrl(selected.url);
      
      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${selected.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: selected.title.substring(0, 60),
            body: `🎧 ${selected.author?.name || 'YouTube'}`,
            thumbnailUrl: selected.thumbnail,
            mediaType: 2,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });

      // Pulisci cache
      delete conn.musicCache[m.sender];
      
    } catch (error) {
      await conn.sendMessage(m.chat, { 
        text: `❌ Errore nel download: ${error.message}` 
      }, { quoted: m });
    }
  }
};

handler.command = ['play2', 'playformat'];
handler.tags = ['music'];
handler.help = [
  'play2 <titolo> - Cerca brani con selezione',
  'playformat <numero> - Scarica il brano selezionato'
];

export default handler;