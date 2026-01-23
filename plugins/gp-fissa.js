let handler = async (m, { conn, command }) => {
if (!m.quoted) return m.reply(`⚠️  𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐚 𝐟𝐢𝐬𝐬𝐚𝐫𝐞 ${command === 'pin' ? 'fissa' : 'pinna'}.`);
try {
let messageKey = {remoteJid: m.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id,
participant: m.quoted.sender
};

if (command === 'pin' || command === 'fissa') {
await conn.sendMessage(m.chat, { pin: messageKey,type: 1, time: 604800 })
//conn.sendMessage(m.chat, {pin: {type: 1, time: 604800, key: messageKey }});
m.react("✅️")
}

if (command === 'unpin' || command === 'nonfissa') {
await conn.sendMessage(m.chat, { pin: messageKey,type: 2, time: 86400 })
//conn.sendMessage(m.chat, { pin: { type: 0, key: messageKey }});
m.react("✅️")
}

if (command === 'pinna') {
conn.sendMessage(m.chat, {keep: messageKey, type: 1, time: 15552000 })
m.react("✅️")
}

if (command === 'pinna2') {
conn.sendMessage(m.chat, {keep: messageKey, type: 2, time: 86400 })
m.react("✅️")
}
} catch (error) {
console.error(error);
}};
handler.help = ['pin']
handler.tags = ['group']
handler.command = ['pin', 'fissa', 'unpin', 'nonfissa', 'pinna', 'pinna2'] 
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.register = true 
export default handler