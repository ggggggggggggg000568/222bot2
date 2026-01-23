const handler = async (m) => {
  if (!global.lastSpeedTest || !global.lastSpeedTest.data) {
    return m.reply("⚠️ Nessun dato avanzato ricevuto.");
  }

  const {
    isp,
    serverName,
    download,
    upload,
    ping,
    jitter,
    packetLoss,
    resultURL,
  } = global.lastSpeedTest.data;

  const msg = `
📊 *DETTAGLI AVANZATI DELLA RETE* 📊

🌐 *ISP:* ${isp}
🏢 *Server:* ${serverName}

⚡ *Download:* ${download} Mbps
⚡ *Upload:* ${upload} Mbps
🏓 *Ping:* ${ping} ms
🔄 *Jitter:* ${jitter} ms
⛔ *Packet Loss:* ${packetLoss}%

🔗 *Risultato Speedtest:*  
${resultURL}

──────────────
Analisi avanzata by 222 Bot
`;

  return m.reply(msg);
};

handler.command = /^speedinfores$/i;
handler.owner = true;

export default handler;
