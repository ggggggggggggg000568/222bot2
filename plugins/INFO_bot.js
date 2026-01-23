import fs from 'fs'

const toMathSymbols = number => {
  const symbols = ['𝟎', '𝟏', '𝟐', '𝟑', '𝟒', '𝟓', '𝟔', '𝟕', '𝟖', '𝟗']
  return number.toString().split('').map(digit => symbols[digit] || digit).join('')
}

const handler = async (m, { conn, usedPrefix }) => {
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  const groups = chats.filter(([id]) => id.endsWith('@g.us'))
  const privateChats = chats.length - groups.length
  const totalUsers = Object.keys(global.db.data.users).length
  const totalPlugins = Object.keys(global.plugins).length

  const image = fs.readFileSync('./settings.png')

  const message = `
🤖 *INFO BOT*

👥 Gruppi: ${toMathSymbols(groups.length)}
👤 Utenti registrati: ${toMathSymbols(totalUsers)}


📚 Usa ${usedPrefix}menu per vedere i comandi
  `

  conn.sendMessage(m.chat, { 
    text: message,
    contextInfo: {
      externalAdReply: {
        title: `Statistiche ${global.nomebot || 'Bot'}`,
        body: "Informazioni del bot",
        thumbnail: image
      }
    }
  })
}

handler.command = ['infobot', 'bot']
export default handler