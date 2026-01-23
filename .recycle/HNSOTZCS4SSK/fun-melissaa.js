
let handler = async (m, { conn, command, text }) => {
if (!text) throw `TI AMO MELISSA`
let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
conn.reply(m.chat, `
*MELISSA É MIA MOGLIEEEEEE! ${text}*

MELISSA TI AMO MELISSA TI AMO MELISSA TI AMO MELISSA TI AMO MELISSA TI AMO 🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵🩵

*${text}* 
🤤 *¡MELISSA SEI PERFETTAAAAAA* 🤤`,null, { mentions: [user] })
}


handler.customPrefix = /melissa/i
handler.admin = true
handler.command = new RegExp
export default handler
