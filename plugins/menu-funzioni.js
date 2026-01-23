let handler = async (m, { conn }) => {
    const chat = global.db.data.chats[m.chat] || {};
    const {
        antiToxic,
        antilinkhard,
        antiPrivate,
        antitraba,
        antiArab,
        antiviewonce,
        isBanned,
        welcome,
        detect,
        sologruppo,
        soloprivato,
        antiCall,
        modohorny,
        gpt,
        antiinsta,
        antielimina,
        antitiktok,
        antiyt,
        antiPorno,
        jadibot,
        modoadmin,
        antiLink
    } = chat;

    const stato = (val) => val ? '✅ 𝑨𝒕𝒕𝒊𝒗𝒂' : '❌𝑫𝒊𝒔𝒂𝒃𝒊𝒍𝒊𝒕𝒂𝒕𝒐';

    const testo = `
✦͙͙˚·˚ ༘ * ＦＵＮＺＩＯＮＩ * ༘ ˚·˚✦͙͙

${stato(detect)}  Detect
${stato(welcome)}  Benvenuto
${stato(gpt)}  GPT
${stato(jadibot)}  Jadibot
${stato(sologruppo)}  Solo Gruppo
${stato(soloprivato)}  Solo Privato
${stato(modoadmin)}  Modo Admin
${stato(isBanned)}  Ban GP
${stato(antiPorno)}  Anti Porno
${stato(antiCall)}  Anti Call
${stato(antitraba)}  Anti Traba
${stato(antiArab)}  Anti Paki
${stato(antiLink)}  Anti Link
${stato(antiinsta)}  Anti Insta
${stato(antitiktok)}  Anti TikTok
${stato(antielimina)}  Anti Elimina
${stato(antiyt)}  Anti YT

⚡ 𝑈𝑠𝑜 𝑅𝑎𝑝𝑖𝑑𝑜
» .𝒂𝒕𝒕𝒊𝒗𝒂 <𝒏𝒐𝒎𝒆>
» .𝒅𝒊𝒔𝒂𝒃𝒊𝒍𝒊𝒕𝒂 <𝒏𝒐𝒎𝒆>
`.trim();

    const buttons = [
        { buttonId: `.menu`, buttonText: { displayText: '🔙 MENU PRINCIPALE' }, type: 1 },
        { buttonId: `.menuadmi.`, buttonText: { displayText: '🛠️ ADＭIＮ' }, type: 1 },
        { buttonId: `.menugruppo`, buttonText: { displayText: '👥 GRUPPO' }, type: 1 }
    ];

    const buttonMessage = {
        text: testo,
        footer: '✦͙͙˚·˚ Gestisci le impostazioni del bot ˚·˚✦͙͙',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ["funzioni"];
handler.tags = ['menu'];
handler.command = /^(funzioni)$/i;

export default handler;