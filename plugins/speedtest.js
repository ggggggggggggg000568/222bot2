import cp from "child_process";
import { promisify } from "util";

const exec = promisify(cp.exec);

const handler = async (m, { conn, usedPrefix }) => {
  await m.reply("⏳ ᴀᴠᴠɪᴏ ᴀɴᴀʟɪꜱɪ ᴅᴇʟʟᴀ ʀᴇᴛᴇ...");

  let o;
  try {
    o = await exec("python3 speed.py --secure --share");
  } catch (e) {
    o = e;
  }

  const stdout = o?.stdout || "";
  if (!stdout.trim()) return m.reply("❌ ᴇʀʀᴏʀᴇ ᴅᴜʀᴀɴᴛᴇ ʟ'ᴇꜱᴇᴄᴜᴢɪᴏɴᴇ ᴅᴇʟʟᴏ ꜱᴘᴇᴇᴅᴛᴇꜱᴛ.");

  // Estrazione valori con fallback di sicurezza
  const extract = (regex, fallback = "0") =>
    stdout.match(regex)?.[1]?.trim() || fallback;

  const isp = extract(/ISP:\s*(.*)/i, "Sconosciuto");
  const serverName = extract(/Server:\s*(.*)/i, "Sconosciuto");
  const download = extract(/Download:\s*([\d.]+)/i, "0");
  const upload = extract(/Upload:\s*([\d.]+)/i, "0");
  const ping = extract(/Ping:\s*([\d.]+)/i, "0");
  const jitter = extract(/Jitter:\s*([\d.]+)/i, "0");
  const packetLoss = extract(/Packet Loss:\s*([\d.]+)/i, "0");
  const resultURL = extract(/(https?:\/\/[^\s]+)/i, "Nessun link");

  // 🔥 SALVATAGGIO A PROVA DI BOMBA
  global.lastSpeedTest = {
    timestamp: Date.now(),
    data: {
      isp,
      serverName,
      download,
      upload,
      ping,
      jitter,
      packetLoss,
      resultURL,
    },
  };

  console.log("🔥 ᴅᴀᴛɪ ꜱᴀʟᴠᴀᴛɪ:", global.lastSpeedTest);

  const msg = `
⚡ *ᴛᴇꜱᴛ ᴅɪ ʀᴇᴛᴇ ᴄᴏᴍᴘʟᴇᴛᴀᴛᴏ* ⚡

🏢 *Server:* ${serverName}

📥 *Download:* ${download} Mbps
📤 *Upload:* ${upload} Mbps
🏓 *Ping:* ${ping} ms

🔗 *Risultato:*  
${resultURL}

──────────────
Speedtest by 222 Bot
`;

  const buttons = [
    {
      buttonId: `${usedPrefix}open ${resultURL}`,
      buttonText: { displayText: "🌐 Apri Risultato" },
    },
    {
      buttonId: `${usedPrefix}speedinfores`,
      buttonText: { displayText: "📊 Dettagli Avanzati" },
    },
    {
      buttonId: `${usedPrefix}speedtest`,
      buttonText: { displayText: "🔄 Rifai Speedtest" },
    },
  ];

  return await conn.sendMessage(m.chat, {
    text: msg,
    footer: "Seleziona un'opzione:",
    buttons,
    headerType: 1,
  });
};

handler.command = /^speedtest$/i;
handler.owner = true;

export default handler;
