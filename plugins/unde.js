import util from 'util';

const handler = async (m, { conn, text }) => {
  if (!text) {
    return conn.reply(m.chat, "⚠️ *Inserisci del codice da deoffuscare!*\n\nEsempio: .unde _0x1234 = '\\x68\\x65\\x6c\\x6c\\x6f';", m);
  }

  // Decodifica i caratteri esadecimali tipo \x68
  const decodeHex = (str) => {
    return str.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  };

  try {
    const decoded = decodeHex(text);

    // Risposta
    await conn.sendMessage(
      m.chat,
      {
        text: "✅ *Codice deoffuscato:*\n```js\n" + decoded + "\n```"
      },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
    return conn.reply(m.chat, "❌ Errore nella deoffuscazione!", m);
  }
};

handler.command = /^unde$/i;
handler.rowner = true;

export default handler;