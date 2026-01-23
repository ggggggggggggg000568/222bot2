import fs from 'fs';

const handler = async (m, { conn, usedPrefix }) => {
  const nomeDelBot = global.db.data.nomedelbot || 'Svo²²² Bot';
  const image = fs.readFileSync('./icone/settings.png'); // o altra immagine

  const prova = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "gestione del gruppo" },
    message: { documentMessage: { title: `${nomeDelBot} 𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎`, jpegThumbnail: image } },
    participant: "0@s.whatsapp.net"
  };

  const text = `⚠️ *COMANDI GESTIONE* ⚠️

Scegli un'opzione:`;

  await conn.sendMessage(
    m.chat,
    {
      text,
      footer: `✦ ${nomeDelBot}`,
      buttons: [
        { buttonId: `${usedPrefix}nuke`, buttonText: { displayText: 'NUKE💥' }, type: 1 },
        { buttonId: `${usedPrefix}rubtest`, buttonText: { displayText: 'RUBA💰' }, type: 1 },
        { buttonId: `${usedPrefix}svo`, buttonText: { displayText: 'SVO🐏' }, type: 1 }
      ],
      headerType: 4,
      jpegThumbnail: image,
    },
    {
      quoted: prova
    }
  );
};

handler.command = /^fallimento$/i;
export default handler;