import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
    const menuText = `
╭═══〔 ✨ 𝑴𝑬𝑵𝑼 𝑮𝑹𝑼𝑷𝑷𝑶 ✨ 〕═══╮

💞  Abbraccia →  @  
💋  Bacia      
☁️  Meteo   →  (città)  
🖼️  HD Foto    
📖  Leggi  →  (foto)  
🎭  Set IG      
🗑️  Elimina IG  
💍  Crea Coppia  
🎲  Tris        
🆔  ID Gruppo   
⚡  Auto Admin  
📩  Invita      
💰  Paghetta    
🏦  Deposita    
🦹  Furto       
👨‍👩‍👧  Famiglia   
🎨  Sticker  (/s)  
👛  Portafoglio  
🤖  Gemini AI   
🛒  Compra      
🐶  NapoliCane  

╰═══〔 ✨ 𝐁𝐨𝐭 𝐌𝐞𝐧𝐮 ✨ 〕═══╯
`.trim();

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}menuadm`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 },
        { buttonId: `${usedPrefix}menuroulette`, buttonText: { displayText: '🎮 ROULETTE' }, type: 1 },
        { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 OWNER' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
    ];

    const buttonMessage = {
        text: menuText,
        footer: '✨ Seleziona un\'opzione qui sotto ✨',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ["menugruppo", "gruppo"];
handler.tags = ['menu'];
handler.command = /^(menugruppo|gruppo)$/i;

export default handler;