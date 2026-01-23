const handler = async (m, { conn }) => {
  const id = m?.msg?.selectedButtonId;
  if (!id) return;

  // Rifai speedtest
  if (id === "speed_again") {
    return conn.fakeReply(m.chat, ".speedtest", m.sender, "🔄 Esecuzione Speedtest…");
  }

  // Info avanzate
  if (id === "speed_info") {
    return m.reply(`
📊 *DETTAGLI AVANZATI*

• Test multi-thread
• Connessione sicura HTTPS
• Selezione server tramite latenza minima
• Analisi risposta e jitter
• Calcolo throughput reale

222 Bot — Network Analyzer
`);
  }

  // Apri immagine
  if (id.startsWith("speed_open:")) {
    const url = id.split("speed_open:")[1];
    if (url === "none") return m.reply("❌ Nessuna immagine disponibile.");
    return conn.sendMessage(m.chat, { image: { url }, caption: "📤 Risultato Speedtest" });
  }
};

handler.customPrefix = /^.*$/;
handler.command = () => false;

export default handler;
