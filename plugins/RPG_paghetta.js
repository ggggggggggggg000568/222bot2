import fetch from 'node-fetch';

let handler = async (m, { isPrems, conn }) => {
  let user = global.db.data.users[m.sender] || { bank: 0, lastclaim: 0 };

  let fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: '💸 𝐏𝐀𝐆𝐇𝐄𝐓𝐓𝐀 💸',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  let currentTime = new Date();
  let timePassed = currentTime - user.lastclaim;

  if (timePassed < 24 * 60 * 60 * 1000) {
    let remainingTime = 24 * 60 * 60 * 1000 - timePassed;
    let remainingTimeString = msToTime(remainingTime);
    return await conn.reply(m.chat, 
`╔═══════════════╗
║ ⏳ 𝐏𝐀𝐆𝐇𝐄𝐓𝐓𝐀 𝐍𝐎𝐍 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐈𝐋𝐄 ⏳
╚═══════════════╝

Devi aspettare ancora *${remainingTimeString}* ⏳ prima di poterla richiedere nuovamente!`, fkontak);
  }

  let moneyToAdd = 500;
  user.bank += moneyToAdd;
  user.lastclaim = currentTime;

  let text = `
╔══════════════════╗
║ 💰 𝐏𝐀𝐆𝐇𝐄𝐓𝐓𝐀 𝐂𝐎𝐍𝐅𝐄𝐑𝐌𝐀𝐓𝐀 💰
╚══════════════════╝

🎉 Complimenti! Hai ricevuto *${moneyToAdd} €* direttamente nel tuo conto bancario.

💼 Continua così, il successo è nelle tue mani!

╔════════════════════╗
║ 🏦 𝐒𝐚𝐥𝐝𝐨 𝐁𝐚𝐧𝐜𝐚𝐫𝐢𝐨: ${user.bank} €
║ 👛 𝐂𝐨𝐧𝐭𝐚𝐧𝐭𝐢 𝐚 𝐝𝐢𝐬𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: ${user.money || 0} €
╚════════════════════╝
`;

  await conn.reply(m.chat, text.trim(), fkontak);
}

function msToTime(duration) {
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let seconds = Math.floor((duration / 1000) % 60);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return `${hours} ore ${minutes} minuti ${seconds} secondi`;
}

handler.command = /^(paghetta)$/i;
handler.isBotAdmin = true;
handler.group = true;
export default handler;