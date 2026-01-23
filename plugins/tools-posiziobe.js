let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: '📍 Per favore inviami la tua posizione',
    footer: 'Clicca sul bottone qui sotto per condividerla',
    interactiveButtons: [
      {
        name: 'send_location',
        buttonParamsJson: JSON.stringify({
          display_text: '📌 Invia la tua posizione'
        })
      }
    ]
  }, { quoted: m });
};

handler.command = ['chiediposto'];
handler.help = ['chiediposto'];
handler.tags = ['tools'];

export default handler;