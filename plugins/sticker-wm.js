import { addExif } from '../lib/sticker.js'
let handler = async (m, { conn, text }) => {
  if (!m.quoted) throw 'Rispondi a uno sticker'
  let stiker = false
  try {
    const [packname = '', author = ''] = text ? text.split('|') : []
    const mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw 'Rispondi a uno sticker WEBP'
    const img = await m.quoted.download()
    stiker = await addExif(img, packname, author)  
  } catch (e) {
    console.error('Error in wm command:', e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) {
      conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
    } else {
      throw 'Errore nella creazione dello sticker. Assicurati di rispondere a uno sticker valido.'
    }
  }
}
handler.help = ['wm <packname>|<author>']
handler.tags = ['sticker']
handler.command = /^robar|wm$/i
export default handler