import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    // Info utente e bot
    const senderName = await conn.getName(m.sender);
    const botName = global.db.data?.nomedelbot || "🤖 𝟐𝟐𝟐 𝐁𝚯𝐓";
    const vs = "1.0.0";

    // Pulsanti
    const buttons = [
        { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: '👥 Gruppo' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ Funzioni' }, type: 1 },
        { buttonId: `${usedPrefix}menuadm`, buttonText: { displayText: '🛠️ Admin' }, type: 1 },
        { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 Owner' }, type: 1 },
        { buttonId: `${usedPrefix}menuroulette`, buttonText: { displayText: '🎮 Roulette' }, type: 1 }
    ];

    // Messaggio high-tech testuale
    const buttonMessage = {text:`
╔═════════════╗
║   ⚡ 𝗠𝗘𝗡𝗨 𝗕𝗢𝗧 ⚡
╠═════════════╣
║ 👤 Utente: ${senderName}
║ 🤖 Bot: ${botName}
║ 🔧 Versione: ${vs}
╚═════════════╝
🚀 Seleziona un pulsante per iniziare...`,
        footer: `─── 🔹 ${botName} 🔹 ───`,
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ["menu"];
handler.tags = ['menu'];
handler.command = /^(menu)$/i;

export default handler;