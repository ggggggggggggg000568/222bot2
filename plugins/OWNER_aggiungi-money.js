let handler = async (m, { conn, args }) => {
  // 🔒 solo owner
  if (!m.isOwner) {
    return conn.reply(m.chat, 'Questo comando è solo per owner 👑', m)
  }

  // 👤 prende utente da menzione o reply
  let target =
    m.mentionedJid?.[0] ||
    (m.quoted ? m.quoted.sender : null)

  if (!target) {
    return conn.reply(m.chat, 'Inserisci la menzione nel comando!', m)
  }

  // 💰 quantità
  let amount = parseInt(args[1] || args[0])
  if (!amount || isNaN(amount) || amount <= 0) {
    return conn.reply(m.chat, 'Inserisci una quantità valida!', m)
  }

  // 🧠 CREA UTENTE SE NON ESISTE
  if (!global.db.data.users[target]) {
    global.db.data.users[target] = {
      money: 0,
      bank: 0,
      exp: 0,
      limit: 20,
      level: 0,
      registered: false
    }
  }

  // ➕ aggiunge in BANCA
  global.db.data.users[target].bank += amount

  // ✅ conferma
  await conn.reply(
    m.chat,
    `💰 Ho aggiunto *${amount}€* in banca a @${target.split('@')[0]}`,
    m,
    { mentions: [target] }
  )
}

handler.help = ['addmoney @user <quantità>']
handler.tags = ['owner']
handler.command = /^addmoney$/i
handler.owner = true

export default handler
