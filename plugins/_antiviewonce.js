let handler = async (m, { args, isOwner }) => {
  if (!m.isGroup) throw 'Questo comando funziona solo nei gruppi'
  if (!isOwner) throw 'Questo comando è solo per OWNER 👑'

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (!args[0]) {
    let status = chat.antiviewonce ? 'ON ✅' : 'OFF ❌'
    throw `🕵️ ANTIVIEWONCE\n\nStato: ${status}\n\nUsa:\n.antiviewonce on\n.antiviewonce off`
  }

  if (args[0] === 'on') {
    chat.antiviewonce = true
    return m.reply('✅ AntiviewOnce ATTIVATO (solo owner)')
  }

  if (args[0] === 'off') {
    chat.antiviewonce = false
    return m.reply('❌ AntiviewOnce DISATTIVATO')
  }
}

handler.before = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  if (!chat?.antiviewonce) return

  // nuove versioni WhatsApp (Baileys)
  if (
    m.mtype === 'viewOnceMessageV2' ||
    m.mtype === 'viewOnceMessageV2Extension'
  ) {
    let viewOnce =
      m.message?.viewOnceMessageV2?.message ||
      m.message?.viewOnceMessageV2Extension?.message

    if (!viewOnce) return

    let type = Object.keys(viewOnce)[0]
    let media = viewOnce[type]

    if (!media) return

    let caption = media.caption || '👁️ ANTIVIEWONCE'

    await conn.sendMessage(
      m.chat,
      {
        [type.replace('Message', '')]: media,
        caption
      },
      { quoted: m }
    )
  }
}

handler.help = ['antiviewonce on/off']
handler.tags = ['owner']
handler.command = /^antiviewonce$/i
handler.group = true
handler.owner = true

export default handler
