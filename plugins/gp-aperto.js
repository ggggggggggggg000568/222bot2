let handler = async (m, { conn, args, usedPrefix, command }) => {
    let option = { '': 'not_announcement' }[args[0] || ''];
    if (option === undefined) return;
    await conn.groupSettingUpdate(m.chat, option);
    
    // Creazione del messaggio con pulsante
    const buttonMessage = {
        text: 'Gruppo Aperto👋🏻',
        footer: 'Clicca per chiudere il gruppo',
        buttons: [
            { buttonId: `${usedPrefix}chiuso`, buttonText: { displayText: '🔒 CHIUDI CHAT' }, type: 1 }
        ],
        headerType: 1
    };
    
    conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ['group open / close', 'chat'];
handler.tags = ['group'];
handler.command = /^(aperto|sblocca|rumore)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;