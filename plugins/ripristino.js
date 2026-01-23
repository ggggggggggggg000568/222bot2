import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const baseDir = process.cwd()
  const oldText = '333BotSession'
  const newText = '333BotSession'
  const allowedExt = ['.js', '.json', '.ts', '.txt', '.md', '.yaml', '.yml']
  let count = 0, modified = []

  const walk = dir => {
    for (let file of fs.readdirSync(dir)) {
      let full = path.join(dir, file)
      let stat = fs.statSync(full)
      if (stat.isDirectory()) walk(full)
      else if (allowedExt.includes(path.extname(file))) {
        let content = fs.readFileSync(full, 'utf8')
        if (content.includes(oldText)) {
          fs.writeFileSync(full, content.split(oldText).join(newText), 'utf8')
          count++
          modified.push(full)
        }
      }
    }
  }

  try {
    walk(baseDir)
    m.reply(
      `✅ Ripristino completato.\n🔁 File modificati: ${count}\n🔄 Da "${oldText}" a "${newText}"\n\n📂 Esempio file modificati:\n${modified.slice(0,10).join('\n')}${modified.length > 10 ? '\n...ecc.' : ''}`
    )
  } catch (e) {
    console.error(e)
    m.reply(`❌ Errore: ${e.message}`)
  }
}

handler.command = ['ripristinasession']
handler.rowner = true

export default handler