let handler = async (m, { conn, args, text }) => {
  if (!text) throw '𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐝𝐞𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐝𝐚 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐫𝐞'
  
  let pluginName = args[0]
  let file = `./plugins/${pluginName}.js`
  
  try {
    const fs = await import('fs')
    if (!fs.existsSync(file)) throw '𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞'
    
    fs.unlinkSync(file)
    await m.reply(`✅ 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 "${pluginName}" 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨`)
    
  } catch (error) {
    if (error === '𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞') {
      await m.reply('❌ 𝐈𝐥 𝐩𝐥𝐮𝐠𝐢𝐧 𝐧𝐨𝐧 𝐞𝐬𝐢𝐬𝐭𝐞')
    } else {
      await m.reply('❌ 𝐄𝐫𝐫𝐨𝐫𝐞 𝐝𝐮𝐫𝐚𝐧𝐭𝐞 𝐥\'𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐳𝐢𝐨𝐧𝐞')
    }
  }
}

handler.help = ['deleteplugin <nome>']
handler.tags = ['owner']
handler.command = /^(deleteplugin|dp)$/i
handler.owner = true

export default handler