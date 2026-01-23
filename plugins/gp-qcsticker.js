import { createCanvas, loadImage } from 'canvas'
import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  try {
    if (!text) return m.reply('💬 𝑰𝒏𝒔𝒆𝒓𝒊𝒔𝒄𝒊 𝒖𝒏 𝒎𝒆𝒔𝒔𝒂𝒈𝒈𝒊𝒐:\n.qc 𝒄𝒊𝒂𝒐 𝒓𝒂𝒈𝒂𝒛𝒛𝒊')

    const target = m.quoted?.sender || m.sender
    const name = await conn.getName(target)
    let profilePic

    try {
      profilePic = await conn.profilePictureUrl(target, 'image')
    } catch {
      profilePic = 'https://i.imgur.com/2wzGhpF.jpeg'  
    }

    const avatar = await loadImage((await axios.get(profilePic, { responseType: 'arraybuffer' })).data)
    const width = 512, height = 220
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#141414'
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.beginPath()
    ctx.arc(60, 60, 45, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, 15, 15, 90, 90)
    ctx.restore()

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 26px serif'
    ctx.fillText(name, 120, 50)

    ctx.font = '22px serif'
    ctx.fillText(text, 120, 90)

    const buffer = canvas.toBuffer()

    // Usa la funzione sticker con packname e author
    const finalSticker = await sticker(buffer, false, global.packname, global.author)

    if (!finalSticker) throw '⚠️ Errore nella creazione dello sticker'

    await conn.sendFile(m.chat, finalSticker, 'sticker.webp', '', m)

  } catch (e) {
    console.error(e)
    m.reply('❌ 𝑬𝒓𝒓𝒐𝒓𝒆 𝒏𝒆𝒍 𝒈𝒆𝒏𝒆𝒓𝒂𝒓𝒆 𝒍𝒐 𝒔𝒕𝒊𝒄𝒌𝒆𝒓.')
  }
}

handler.command = ['qc']
handler.help = ['qc <messaggio>']
handler.tags = ['fun']
export default handler