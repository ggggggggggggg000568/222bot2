let handler = async (m, { conn }) => {
  
  console.log("TRACKER FUNZIONA:", m.sender)

  
    // --- Normalizza il JID ---
    let sender = m.sender || m.key.remoteJid || null
    if (!sender) return

    // --- Il bot non deve contare i messaggi inviati da se stesso ---
    let botJid = conn.user.jid
    if (sender === botJid) return

    // --- Conta anche i messaggi "fromMe" (se il bot usa il tuo numero) ---
    // Quindi NON ignoriamo m.fromMe

    // --- Normalizza altri formati ---
    sender = sender.replace(/:.*@/, "@").replace(/\.us$/, "@s.whatsapp.net")

    // --- Inizializza il profilo ---
    let user = global.db.data.users[sender]
    if (!user) {
        global.db.data.users[sender] = { messaggi: 0 }
        user = global.db.data.users[sender]
    }

    // --- Incremento sicuro ---
    user.messaggi = (user.messaggi || 0) + 1
}

handler.all = true
export default handler
