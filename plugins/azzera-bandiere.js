import fs from 'fs';

const CLASSIFICA_PATH = './bandieraclassifica.json';

const handler = async (m, { isAdmin, isROwner }) => {
  if (!isAdmin && !isROwner) {
    return m.reply("🚫 Solo un admin può azzerare la classifica.");
  }

  if (fs.existsSync(CLASSIFICA_PATH)) {
    fs.writeFileSync(CLASSIFICA_PATH, '{}');
    return m.reply("🧹 Classifica azzerata con successo!");
  } else {
    return m.reply("📉 Nessuna classifica da azzerare.");
  }
};

handler.help = ['azzera'];
handler.tags = ['game'];
handler.command = /^azzerabandiere$/i;
handler.group = true;
handler.owner = true;

export default handler;