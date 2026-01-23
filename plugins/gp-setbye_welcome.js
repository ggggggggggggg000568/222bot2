let handler = async (m, { conn, text, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ Solo nei gruppi')
    if (!isAdmin && !isOwner) return m.reply('❌ Solo admin')
    
    const chat = global.db.data.chats[m.chat]
    const cmd = m.text.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')
    
    if (['setbenvenuto', 'setwelcome'].includes(cmd)) {
        if (!text) return m.reply('❌ Inserisci il messaggio\nEs: .setbenvenuto Benvenuto @user!')
        
        if (text.toLowerCase() === 'reset') {
            chat.sWelcome = null
            m.reply('✅ Benvenuto resettato')
        } else {
            chat.sWelcome = text
            m.reply('✅ Benvenuto impostato')
        }
        
    } else if (['setaddio', 'setgoodbye', 'setbye'].includes(cmd)) {
        if (!text) return m.reply('❌ Inserisci il messaggio\nEs: .setaddio Addio @user!')
        
        if (text.toLowerCase() === 'reset') {
            chat.sBye = null
            m.reply('✅ Addio resettato')
        } else {
            chat.sBye = text
            m.reply('✅ Addio impostato')
        }
    }
}

handler.command = /^(setbenvenuto|setwelcome|setaddio|setgoodbye|setbye)$/i
handler.group = true
handler.admin = true

export default handler