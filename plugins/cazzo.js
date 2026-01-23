let handler = async (m, { conn, command, text }) => {
let love = `-------☾︎☠︎☽-------︎\n𝙲𝙰𝙻𝙲𝙾𝙻𝙰𝚃𝙾𝚁𝙴 𝙳𝙸 𝙲𝙰𝚉𝚉𝙾 🍆
 ${text} 𝚑𝚊 𝚒𝚕 𝚌𝚊𝚣𝚣𝚘 𝚕𝚞𝚗𝚐𝚘 ${Math.floor(Math.random() * 100)}𝚌𝚖\n-------☾︎☠︎☽-------︎`.trim()
m.reply(love, null, { mentions: conn.parseMention(love) })}
handler.command = /^(cazzo)$/i
export default handler

