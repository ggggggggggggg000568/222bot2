const handler = async (m, { conn, args }) => {
    const interactiveButtons = [
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "Whatsapp",
                url: "https://wa.me/393201448716"
            })
        },
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "Telegram",
                url: "https://t.me/esiliatore"
            })
        },
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: "Instagram",
                url: "https://instagram.com/filippootozzii"
            })
        }
    ];

    const interactiveMessage = {
        text: "*ECCO I CONTATTI DELL'OWNER*",
        title: "Seleziona un link:",
        footer: "Clicca per contattarlo",
        interactiveButtons
    };

    await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
};

handler.help = ['linkesterni'];
handler.tags = ['info'];
handler.command = /^contatti$/i;

export default handler;