const handler = async (m, { conn, args }) => {
  let target

  // 1️⃣ se tagghi qualcuno
  if (m.mentionedJid && m.mentionedJid.length) {
    target = m.mentionedJid[0]

  // 2️⃣ se rispondi a un messaggio
  } else if (m.quoted) {
    target = m.quoted.sender
  }

  if (!target) {
    return conn.reply(m.chat, 'Inserisci la menzione nel comando!', m)
  }

  const user = global.db.data.users[target]
  if (!user) {
    return conn.reply(m.chat, 'Utente non trovato nel database!', m)
  }

  const amount = parseInt(args[args.length - 1])
  if (isNaN(amount) || amount <= 0) {
    return conn.reply(m.chat, 'Inserisci un numero valido!', m)
  }

  user.bank = (user.bank || 0) + amount

  conn.reply(
    m.chat,
    `💰 Ho aggiunto *${amount}€* in banca a @${target.split('@')[0]}`,
    m,
    { mentions: [target] }
  )
}

handler.command = /^addmoney$/i
handler.owner = true

export default handler
