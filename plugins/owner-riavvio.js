const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handler = async (m, { conn }) => {
  const { key } = await conn.sendMessage(m.chat, { text: `🔄 Sto riavviando...` }, { quoted: m });

  await delay(1000);
  await conn.sendMessage(m.chat, { text: `🚀`, edit: key });

  await delay(1000);
  await conn.sendMessage(m.chat, { text: `✅ Riavvio completato.`, edit: key });

  try {
    if (process.send) process.send('reset');
  } catch (e) {
    console.error('[⚠️] Impossibile inviare process.send:', e);
  }

  process.exit(0);
};

handler.help = ['riavvia'];
handler.tags = ['owner'];
handler.command = ['riavvia', 'reiniciar'];
handler.owner = true;

export default handler;
