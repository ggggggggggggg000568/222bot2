const handler = async (m, { args, conn }) => {
  if (!args[0]) return m.reply("⚠️ Nessun link da aprire.");
  await conn.sendMessage(m.chat, { image: { url: args[0] }, caption: "📤 Risultato Speedtest" });
};

handler.command = /^open$/i;
export default handler;
