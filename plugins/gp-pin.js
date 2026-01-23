const handler = async (m, { conn, args }) => {
    const durations = {
        "24h": "PT24H",
        "7d": "P7D",
        "30d": "P30D"
    };

    let durationKey = args[0] || "24h";
    let pinDuration = durations[durationKey];

    if (!pinDuration) {
        return conn.reply(m.chat, "Specifica una durata valida: 24h, 7d o 30d.", m);
    }

    if (!m.quoted) {
        return conn.reply(m.chat, "❌ Devi rispondere a un messaggio per fissarlo.", m);
    }

    // Controlla se il bot è amministratore
    const groupMetadata = await conn.groupMetadata(m.chat);
    const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    const botIsAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);

    if (!botIsAdmin) {
        return conn.reply(m.chat, "❌ Devo essere amministratore per fissare messaggi!", m);
    }

    try {
        // Ottenere l'ID corretto del messaggio
        let messageID = m.quoted.id || m.quoted.messageContextInfo.stanzaId;

        // Fissa il messaggio
        await conn.sendMessage(m.chat, { pinMessage: messageID, pinDuration });

        conn.reply(m.chat, `✅ Messaggio fissato per ${durationKey}.`, m);
    } catch (err) {
        conn.reply(m.chat, "❌ Errore nel fissare il messaggio.", m);
        console.error(err);
    }
};

handler.command = /^(pin|fissa)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;