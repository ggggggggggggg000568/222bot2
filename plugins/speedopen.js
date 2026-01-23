const handler = async (m, { conn }) => {
    if (!global.lastSpeedtest?.resultURL)
        return m.reply("❌ Non ci sono risultati da aprire!");

    conn.sendMessage(m.chat, { text: global.lastSpeedtest.resultURL }, { quoted: m });
};

handler.command = /^speedopen$/i;

export default handler;
