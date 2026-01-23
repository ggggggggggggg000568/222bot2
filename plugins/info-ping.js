import { performance } from 'perf_hooks';

const clockString = ms => {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
};

const handler = async (m, { conn }) => {
  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);

  const start = performance.now();
  const end = performance.now();
  const speed = (end - start).toFixed(4);

  const info = `
🚀 PING DEL BOT

⏳ Attività: ${uptime}
⚡ Risposta: ${speed} sec
`;

  // Messaggio con bottone
  await conn.sendMessage(m.chat, {
    text: info.trim(),
    footer: "Scegli un'opzione:",
    buttons: [
      {
        buttonId: ".ds",
        buttonText: { displayText: "Svuota Sessioni🗑️" },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m });
};

handler.command = /^ping$/i;

export default handler;