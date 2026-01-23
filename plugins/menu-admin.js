import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
    const menu = `
╔═══════════════╗
║     ＭＥＮＵ　ＡＤＭＩＮ        
╠═══════════════╣
║ ► ${usedPrefix}promuovi / p
║ ► ${usedPrefix}retrocedi / r
║ ► ${usedPrefix}warn / unwarn
║ ► ${usedPrefix}muta / smuta
║ ► ${usedPrefix}mutelist
║ ► ${usedPrefix}hidetag
║ ► ${usedPrefix}tagall
║ ► ${usedPrefix}aperto / chiuso
║ ► ${usedPrefix}setwelcome
║ ► ${usedPrefix}setbye
║ ► ${usedPrefix}inattivi
║ ► ${usedPrefix}listanum + prefisso
║ ► ${usedPrefix}pulizia + prefisso
║ ► ${usedPrefix}rimozione inattivi
║ ► ${usedPrefix}sim
║ ► ${usedPrefix}admins
║ ► ${usedPrefix}freeze @
║ ► ${usedPrefix}ispeziona <link>
║ ► ${usedPrefix}top (10, 50, 100)
║ ► ${usedPrefix}topsexy
║ ► ${usedPrefix}pic @
║ ► ${usedPrefix}picgruppo
║ ► ${usedPrefix}nome <testo>
║ ► ${usedPrefix}bio <testo>
║ ► ${usedPrefix}linkqr
║ ► ${usedPrefix}startranking
║ ► ${usedPrefix}rankoggi
║ ► ${usedPrefix}topgruppioggi
║ ► ${usedPrefix}stats
╚═══════════════╝
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '◄ MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}tagall`, buttonText: { displayText: '◆ TAG ALL' }, type: 1 },
        { buttonId: `${usedPrefix}top 10`, buttonText: { displayText: '▲ TOP 10' }, type: 1 }
    ];

    const buttonMessage = {
        text: menu,
        footer: '⌬ Comandi disponibili per gli admin ⌬',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ["menuadm", "admin"];
handler.tags = ['menu'];
handler.command = /^(menuadmin|admin)$/i;

export default handler;