let handler = async (m, { conn, text }) => {
    if (!text && !m.quoted) {
        return conn.reply(m.chat, '❌ Devi menzionare un utente o rispondere al suo messaggio', m);
    }
    
    let who;
    if (m.isGroup) {
        if (m.quoted) {
            who = m.quoted.sender;
        } else if (text) {
            who = m.mentionedJid[0];
        }
    } else {
        who = m.chat;
    }
    
    if (!who) {
        return conn.reply(m.chat, '❌ Impossibile trovare l\'utente da sbloccare', m);
    }
    
    // Verifica se l'utente esiste nel database
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[who]) global.db.data.users[who] = {};
    
    // Sblocca l'utente
    global.db.data.users[who].banned = false;
    
    conn.reply(m.chat, '✅ *Utente sbloccato*\n\n𝐐𝐮𝐞𝐬𝐭𝐨 𝐮𝐭𝐞𝐧𝐭𝐞 𝐩𝐨𝐭𝐫𝐚\' 𝐞𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐝𝐢 𝐧𝐮𝐨𝐯𝐨 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢', m);
};

handler.help = ['unbanuser'];
handler.tags = ['owner'];
handler.command = /^unbanuser|unban$/i;
handler.owner = true;

export default handler;