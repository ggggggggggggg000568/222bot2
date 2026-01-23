const handler = async (m, { conn, text, usedPrefix }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.quoted;
  const who = mention || m.sender;

  const sender = global.db.data.users[m.sender];
  const target = global.db.data.users[who];

  if (!text) {
    return m.reply("𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐥'𝐮𝐬𝐞𝐫𝐧𝐚𝐦𝐞 𝐧𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨");
  }

  const usernameMatch = text.match(/instagram\.com\/([^/?]+)/i);
  const instagramUsername = usernameMatch ? usernameMatch[1] : text.trim();

  if (instagramUsername) {
    if (who === m.sender) {
      sender.nomeinsta = instagramUsername;
    } else {
      target.nomeinsta = instagramUsername;
    }

    conn.reply(m.chat, `ⓘ 𝐇𝐚𝐢 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨 𝐢𝐥 𝐭𝐮𝐨 𝐧𝐨𝐦𝐞 𝐢𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐜𝐨𝐦𝐞 ${instagramUsername}\n> 𝐓𝐢 𝐬𝐞𝐢 𝐩𝐞𝐧𝐭𝐢𝐭𝐨? 𝐔𝐬𝐚 𝐢𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 ${usedPrefix}rimuoviig 𝐩𝐞𝐫 𝐫𝐢𝐦𝐮𝐨𝐯𝐞𝐫𝐥𝐨!`, m);
  }
};

handler.command = ['setig', 'seting'];
export default handler;