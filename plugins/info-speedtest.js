const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("⚠️ Nessun dato avanzato ricevuto.");

  let advanced;

  try {
    advanced = JSON.parse(text);
  } catch {
    advanced = text;
  }

  const msg = `
📊 *DETTAGLI AVANZATI SPEEDTEST*

${advanced}

━━━━━━━━━━━━━━
⚡ 222 Bot
`;

  await conn.reply(m.chat, msg.trim(), m);
};

handler.command = /^speedinfores$/i;
export default handler;
