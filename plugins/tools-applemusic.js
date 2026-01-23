import axios from 'axios';

const handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`❌ Specifica una ricerca musicale.\nEsempio: .music Lazza 100 messaggi`);

  try {
    const res = await axios.get(`https://itunes.apple.com/search`, {
      params: { term: text, media: 'music', limit: 1 }
    });

    const track = res.data.results?.[0];
    if (!track) return m.reply(`🚫 Nessuna traccia trovata per: ${text}`);

    const message = `🎵 *Risultato trovato!*\n\n` +
      `📀 Titolo: ${track.trackName}\n` +
      `🎤 Artista: ${track.artistName}\n` +
      `💿 Album: ${track.collectionName}\n` +
      `🌍 iTunes: ${track.trackViewUrl}`;

    await conn.sendMessage(m.chat, {
      audio: { url: track.previewUrl },
      mimetype: 'audio/mp4',
      fileName: `${track.trackName} - ${track.artistName}.m4a`,
      caption: message
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply(`⚠️ Errore durante la ricerca. Riprova tra poco.`);
  }
};

handler.command = ['music', 'song', 'itunes'];
handler.help = ['music <titolo o artista>'];
handler.tags = ['tools', 'audio'];

export default handler;