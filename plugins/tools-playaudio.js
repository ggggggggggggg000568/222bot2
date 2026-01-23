import yts from 'yt-search';
import axios from 'axios';
import fs from 'fs';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const ddownr = {
  download: async (url, format = 'mp3') => {
    if (!formatAudio.includes(format)) throw new Error('Formato non supportato.');

    const { data } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`, 
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (data?.success) {
      return {
        id: data.id,
        title: data.title,
        downloadUrl: await ddownr.cekProgress(data.id),
        thumbnail: data.info?.image
      };
    }
    throw new Error('Errore nel recupero dei dettagli del video.');
  },

  cekProgress: async (id) => {
    while (true) {
      const { data } = await axios.get(
        `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );

      if (data?.success && data.progress === 1000) return data.download_url;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  // Verifica file richiesti (stile originale)
  const requiredFiles = [
    './CODE_OF_CONDUCT.md',
    './bal.png',
    './termini.jpeg',
    './plugins/OWNER_file.js'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length) {
    return await conn.sendMessage(m.chat, { 
      text: '❗ 𝐏𝐄𝐑 𝐔𝐒𝐀𝐑𝐄 𝐐𝐔𝐄𝐒𝐓𝐎 𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐔𝐒𝐀 𝐋𝐀 𝐁𝐀𝐒𝐄 𝐃𝐈 𝐅𝐈𝐋𝐎' 
    }, { quoted: m });
  }

  if (command === 'play2') {
    if (!text?.trim()) {
      return await conn.sendMessage(m.chat, { 
        text: '🎵 𝐈𝐍𝐒𝐄𝐑𝐈𝐒𝐂𝐈 𝐈𝐋 𝐍𝐎𝐌𝐄 𝐃𝐄𝐋 𝐁𝐑𝐀𝐍𝐎\n𝐄𝐒𝐄𝐌𝐏𝐈𝐎: .play2 Daft Punk - Get Lucky' 
      }, { quoted: m });
    }

    const search = await yts(text);
    const videos = search.videos.slice(0, 5);
    if (!videos.length) return m.reply('🔍 𝐍𝐄𝐒𝐒𝐔𝐍 𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐎 𝐓𝐑𝐎𝐕𝐀𝐓𝐎');

    // Creazione delle card (stile ytsearch)
    const musicCards = videos.map(video => ({
      image: { url: video.thumbnail },
      title: video.title,
      body: `🎵 *Durata:* ${video.timestamp}\n👁 *Visualizzazioni:* ${video.views.toLocaleString()}\n🎤 *Artista:* ${video.author.name}`,
      footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Music'
    }));

    // Invio risultati (stile ytsearch)
    await conn.sendMessage(m.chat, {
      text: '🎧 𝐑𝐈𝐒𝐔𝐋𝐓𝐀𝐓𝐈 𝐌𝐔𝐒𝐈𝐂𝐀𝐋𝐈',
      title: '🔊 music search',
      footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Music',
      cards: musicCards
    }, { quoted: m });

    // Pulsanti (stile ytsearch)
    const buttons = videos.map((video, index) => ({
      buttonId: '.playformat ' + (index + 1),
      buttonText: { displayText: '' + (index + 1) },
      type: 1
    }));

    await conn.sendMessage(m.chat, {
      text: '🔢 𝐒𝐄𝐋𝐄𝐙𝐈𝐎𝐍𝐀 𝐔𝐍 𝐁𝐑𝐀𝐍𝐎 𝐃𝐀 𝐒𝐂𝐀𝐑𝐈𝐂𝐀𝐑𝐄:',
      footer: '𝟐𝟐𝟐 𝐁𝚯𝐓 ✦ Music',
      buttons: buttons,
      headerType: 1
    }, { quoted: m });

    // Salva in cache
    conn.musicCache = conn.musicCache || {};
    conn.musicCache[m.chat] = videos;

  } else if (command === 'playformat') {
    if (!conn.musicCache?.[m.chat]) {
      return m.reply('❌ 𝐍𝐄𝐒𝐒𝐔𝐍𝐀 𝐑𝐈𝐂𝐄𝐑𝐂𝐀 𝐈𝐍 𝐂𝐀𝐂𝐇𝐄. 𝐔𝐒𝐀 𝐏𝐑𝐈𝐌𝐀 .play2');
    }

    const index = parseInt(text) - 1;
    const videos = conn.musicCache[m.chat];

    if (isNaN(index) || index < 0 || index >= videos.length) {
      return m.reply(`❌ 𝐈𝐍𝐒𝐄𝐑𝐈𝐒𝐂𝐈 𝐔𝐍 𝐍𝐔𝐌𝐄𝐑𝐎 𝐓𝐑𝐀 1 𝐄 ${videos.length}`);
    }

    const selected = videos[index];
    const { title, thumbnail, timestamp, views, url, author } = selected;

    // Messaggio di attesa (stile play originale)
    const infoMsg = `
> 𝟐𝟐𝟐 𝐁𝚯𝐓 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝
⭐ *Titolo:* ${title}
⏳ *Durata:* ${timestamp}
👁️ *Visualizzazioni:* ${new Intl.NumberFormat().format(views)}
📺 *Canale:* ${author?.name || 'Sconosciuto'}
📅 *Pubblicato:* ${selected.ago}
> *invio audio in corso...*`;

    await conn.sendMessage(m.chat, { 
      image: { url: thumbnail }, 
      caption: infoMsg,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "YouTube Music Downloader",
          mediaType: 1,
          previewType: 0,
          thumbnail: (await conn.getFile(thumbnail))?.data,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    try {
      // Download usando le stesse API del comando originale
      const audioData = await ddownr.download(url, 'mp3');

      // Invia audio
      await conn.sendMessage(m.chat, {
        audio: { url: audioData.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,

      }, { quoted: m });

    } catch (error) {
      console.error('Errore download:', error);
      m.reply('❌ 𝐄𝐑𝐑𝐎𝐑𝐄: 𝐍𝐨𝐧 𝐡𝐨 𝐩𝐨𝐭𝐮𝐭𝐨 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐫𝐞 𝐢𝐥 𝐛𝐫𝐚𝐧𝐨');
    }
  }
};

handler.command = ['play2', 'playformat'];
handler.tags = ['music'];
handler.help = [
  'play2 <titolo> - Cerca brani musicali',
  'playformat <numero> - Scarica il brano selezionato'
];

export default handler;