const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  const who = mention || m.sender;
  const users = global.db.data.users;
  const user = users[who];

  const banca = user.bank ?? 0;
  const furti = user.furti ?? 0;
  const ultimo = user.datafurto ?? "Mai";
  const rubati = user.rubati ?? 0;

  const testo = `
╭══🏦 𝗖𝗢𝗡𝗧𝗢 𝗕𝗔𝗡𝗖𝗔𝗥𝗜𝗢 ══╮
│ 💰 Saldo: *${banca} €*
╰════════════════╯

╭══🥷 𝗦𝗧𝗔𝗧𝗢 𝗙𝗨𝗥𝗧𝗜 ══╮
│ 📊 Totali     : *${furti}*
│ 🕓 Ultimo     : *${ultimo}*
│ 💸 Guadagno : *${rubati} €*
╰═════════════╯`;

  const prova = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Banca"
    },
    message: {
      contactMessage: {
        displayName: `𝐁𝐚𝐧𝐜𝐚`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${who.split`@`[0]}:${who.split`@`[0]}\nitem1.X-ABLabel:Cell\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  conn.reply(m.chat, testo, prova);
};

handler.command = /^banca$/i;
export default handler;