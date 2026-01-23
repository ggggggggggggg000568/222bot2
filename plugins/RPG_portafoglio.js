const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
  const who = mention || m.sender;
  const users = global.db.data.users;
  const user = users[who];

  const contanti = user.money ?? 0;
  const depositi = user.depositi ?? 0;
  const prelievi = user.prelievi ?? 0;

  const testo = `
╭══🎒 𝗣𝗢𝗥𝗧𝗔𝗙𝗢𝗚𝗟𝗜𝗢 ══╮
│ 💵 Contanti : *${contanti} €*
│ 🔄 Depositi : *${depositi} €*
│ 🔁 Prelievi : *${prelievi} €*
╰══════════════╯`;

  const prova = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Portafoglio"
    },
    message: {
      contactMessage: {
        displayName: `𝐏𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${who.split`@`[0]}:${who.split`@`[0]}\nitem1.X-ABLabel:Cell\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  conn.reply(m.chat, testo, prova);
};

handler.command = /^portafoglio$/i;
export default handler;