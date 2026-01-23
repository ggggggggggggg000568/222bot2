import fs from 'fs';

let handler = async (message, { text, usedPrefix, command }) => {
  if (!text) throw '𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐝𝐚 𝐞𝐝𝐢𝐭𝐚𝐫𝐞';
  if (!message.quoted || !message.quoted.text) throw '𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐢𝐨 𝐜𝐡𝐞 𝐜𝐨𝐧𝐭𝐢𝐞𝐧𝐞 𝐢𝐥 𝐧𝐮𝐨𝐯𝐨 𝐜𝐨𝐝𝐢𝐜𝐞 𝐝𝐚 𝐢𝐧𝐬𝐞𝐫𝐢𝐫𝐞';

  let pluginPath = `plugins/${text}.js`;

  // Controlla se il file esiste
  if (!fs.existsSync(pluginPath)) throw '𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞';

  // Sovrascrive il contenuto del plugin
  fs.writeFileSync(pluginPath, message.quoted.text);

  // Risposta semplice e veloce
  await message.reply(`✅ 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 "${text}" 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐞𝐝𝐢𝐭𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨`);
};

handler.tags = ['owner'];
handler.command = /^editpl$/i;
handler.rowner = true;

export default handler;