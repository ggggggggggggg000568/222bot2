let handler = async (m, { conn, text, mentionedJid, args }) => {
  if (!text && !(mentionedJid || []).length && !m.quoted)
    throw `*❗ Devi menzionare o rispondere a un utente!*`
  
  let users = []

  if ((mentionedJid || []).length) {
    users = mentionedJid
  } else if (m.quoted) {
    users = [m.quoted.sender]
  } else if (args.length) {
    for (let arg of args) {
      arg = arg.replace(/[^0-9]/g, '')
      if (arg.length >= 11 && arg.length <= 13) {
        users.push(arg + '@s.whatsapp.net')
      }
    }
  }

  if (!users.length) throw `*❗ Nessun utente valido trovato!*`

  for (let user of users) {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote').catch(() => {})
  }
}
handler.help = ['*593xxx*','*@utente*','*rispondi al messaggio*'].map(v => 'demote ' + v)
handler.tags = ['group']
handler.command = /^(demote|retrocedi|togliadmin|r)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler