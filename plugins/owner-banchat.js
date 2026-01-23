let handler = async (m) => {
global.db.data.chats[m.chat].isBanned = true
m.reply('𝕀𝐋 𝐁𝕆𝐓 𝕊𝕀 𝚵 𝚲𝐃𝐃Ꮻ𝐑𝐌𝚵𝐍𝐓𝚲𝐓Ꮻ💤')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat|off$/i
handler.rowner = true
export default handler
