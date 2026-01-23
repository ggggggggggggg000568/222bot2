import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw '𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐩𝐚𝐭𝐡 𝐝𝐞𝐥 𝐟𝐢𝐥𝐞 𝐝𝐚 𝐞𝐝𝐢𝐭𝐚𝐫𝐞';
  if (!m.quoted || !m.quoted.text) throw '𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐢𝐨 𝐜𝐡𝐞 𝐜𝐨𝐧𝐭𝐢𝐞𝐧𝐞 𝐢𝐥 𝐧𝐮𝐨𝐯𝐨 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨 𝐝𝐞𝐥 𝐟𝐢𝐥𝐞';
  
  let filePath = text;
  
  // Controlla se il file esiste
  if (!fs.existsSync(filePath)) throw '𝐈𝐥 𝐟𝐢𝐥𝐞 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞';
  
  // Sovrascrive il contenuto del file
  fs.writeFileSync(filePath, m.quoted.text);

  conn.reply(m.chat, `✅ 𝐈𝐥 𝐟𝐢𝐥𝐞 "${text}" 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐞𝐝𝐢𝐭𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨`, m);
};

handler.tags = ['owner'];
handler.command = /^editfile$/i;
handler.rowner = true;

export default handler;