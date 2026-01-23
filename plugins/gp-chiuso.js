let handler = async (m, { conn, usedPrefix }) => {
    await conn.groupSettingUpdate(m.chat, 'announcement');
    
    const buttonMessage = {
        text: 'Gruppo Chiuso🙊',
        footer: 'Clicca per aprire il Gruppo',
        buttons: [
            { buttonId: `${usedPrefix}aperto`, buttonText: { displayText: '🔓 Apri Chat' }, type: 1 }
        ],
        headerType: 1
    };
    
    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ['chiudo'];
handler.tags = ['group'];
handler.command = /^(chiuso|close|blocca|silenzio)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;