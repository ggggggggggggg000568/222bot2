import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {

    // 1️⃣ Controllo che si risponda a qualcosa
    if (!m.quoted) {
        await m.reply(`⚠️ Rispondi a uno *sticker* con: ${usedPrefix + command}`)
        return
    }

    const q = m.quoted
    let mime = (q.msg || q).mimetype || ""

    // 2️⃣ Controllo che sia un WEBP (sticker statico o animato)
    if (!mime.includes("webp")) {
        await m.reply(`⚠️ Devi rispondere a uno *sticker* (non a un messaggio).`)
        return
    }

    // 3️⃣ Scarico lo sticker
    let buffer = await q.download().catch(() => null)
    if (!buffer || !Buffer.isBuffer(buffer)) {
        await m.reply("❌ Errore: impossibile scaricare lo sticker.")
        return
    }

    // Preparo file temporanei
    let tempIn = path.join('./temp/', `${Date.now()}-in.webp`)
    let tempOut = path.join('./temp/', `${Date.now()}-out.png`)
    fs.writeFileSync(tempIn, buffer)

    let png = null

    // 4️⃣ Tentativo conversione standard (sticker statico)
    try {
        png = await webp2png(buffer)
    } catch { png = null }

    // 5️⃣ Se la conversione fallisce → estrai primo frame con ffmpeg
    if (!png || !Buffer.isBuffer(png)) {

        await new Promise(resolve => {
            exec(`ffmpeg -i "${tempIn}" -vf "select=eq(n\\,0)" "${tempOut}" -y`, () => resolve())
        })

        if (fs.existsSync(tempOut)) {
            png = fs.readFileSync(tempOut)
        } else {
            await m.reply("❌ Non riesco a convertire questo sticker (anche come animato).")
            return
        }
    }

    // 6️⃣ Ultima protezione anti-crash prima di inviare
    if (!png || !Buffer.isBuffer(png)) {
        await m.reply("❌ Errore finale: PNG non valido.")
        return
    }

    // 7️⃣ Invio il PNG
    await conn.sendFile(m.chat, png, "sticker.png", "", m).catch(async () => {
        await m.reply("❌ Errore durante l'invio del file.")
    })

    // 8️⃣ Pulizia file temporanei
    try {
        if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn)
        if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut)
    } catch { }
}

handler.help = ['toimg (rispondi a uno sticker)']
handler.tags = ['sticker']
handler.command = ['toimg', 'jpg', 'png']

export default handler
