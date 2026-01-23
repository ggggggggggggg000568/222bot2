let handler = async (m, { conn, text, isROwner, isOwner }) => {
if (text) {
global.db.data.chats[m.chat].sBye = text
m.reply('ⓘ 𝐈 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐨 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨')
} else throw `> ⓘ 𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐝𝐢 𝐚𝐛𝐛𝐚𝐧𝐝𝐨𝐧𝐨 𝐜𝐡𝐞 𝐝𝐞𝐬𝐢𝐝𝐞𝐫𝐢 𝐚𝐠𝐠𝐢𝐮𝐧𝐠𝐞𝐫𝐞, 𝐮𝐬𝐚:\n> - @user ( menzione )\n> - @subject ( nome del gruppo )\n> - @desc ( descrizione del gruppo)`
}
handler.help = ['setbye <text>']
handler.tags = ['group']
handler.command = ['setbye'] 
handler.admin = true
export default handler
