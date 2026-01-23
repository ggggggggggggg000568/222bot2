const handler = async (m, { conn, command }) => {
    if (command === 'membri') {
        try {
            // 1. Verifica preliminare con m.chat.endsWith('@g.us') (la più veloce)
            if (!m.chat.endsWith('@g.us')) {
                return conn.reply(m.chat, 'Questo comando può essere usato solo nei gruppi!', m);
            }

            // 2. Recupera i metadati del gruppo (se la prima verifica passa)
            let groupMetadata;
            try {
                groupMetadata = await conn.groupMetadata(m.chat);
            } catch (metadataError) {
                console.error("Errore nel recupero dei metadati:", metadataError);
                return conn.reply(m.chat, "Errore nel recupero delle informazioni del gruppo.", m);
            }

            // 3. Verifica finale con groupMetadata (la più accurata)
            if (!groupMetadata || !groupMetadata.id.endsWith('@g.us')) {
                return conn.reply(m.chat, 'Questo comando può essere usato solo nei gruppi!', m);
            }

            const participants = groupMetadata.participants;
            const memberCount = participants.length;

            const message = {
                text: `👥 𝕀𝐋 𝐆𝐑𝐔𝐏𝐏Ꮻ 𝐇𝚲 𝚲𝐓𝐓𝐔𝚲𝐋𝐌𝚵𝐍𝐓𝚵 ${memberCount} 𝐌𝚵𝐌𝐁𝐑𝕀`,
            };

            await conn.sendMessage(m.chat, message, { quoted: m });

        } catch (error) {
            console.error("Errore generale nel comando membri:", error);
            await conn.reply(m.chat, "Si è verificato un errore durante l'esecuzione del comando.", m);
        }
    }
};

handler.command = /^(membri)$/i;
// handler.group = true; // Non è più necessario, la verifica è fatta internamente
handler.admin = false;
handler.botAdmin = false;

export default handler;