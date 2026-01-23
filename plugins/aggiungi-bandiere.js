import fs from 'fs';

const CLASSIFICA_PATH = './bandieraclassifica.json';

const handler = async (m, { conn, args }) => {
  if (!args[0] || isNaN(args[0])) {
    return m.reply("❗ Usa: *!bandierapunti <numero>* per aggiungere punti.");
  }

  const punti = parseInt(args[0]);
  const jid = m.sender;

  let classifica = {};
  if (fs.existsSync(CLASSIFICA_PATH)) {
    classifica = JSON.parse(fs.readFileSync(CLASSIFICA_PATH, 'utf-8'));
  }

  classifica[jid] = (classifica[jid] || 0) + punti;

  fs.writeFileSync(CLASSIFICA_PATH, JSON.stringify(classifica, null, 2));
  m.reply(`✅ Hai ricevuto *${punti}* punti! 🏳️ Totale: *${classifica[jid]}*`);
};

handler.help = ['bandierapunti <numero>'];
handler.tags = ['game'];
handler.command = /^bandierapunti$/i;
handler.group = true;
handler.owner = true;

export default handler;