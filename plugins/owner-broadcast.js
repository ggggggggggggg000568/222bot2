let handler = async (m, { isOwner, conn, args, command }) => {
    if (!isOwner) {
        global.dfail("owner", m, conn);
        throw false;
    }

    let messageContent = args.join` `;
    if (!messageContent) {
        throw "❌ Inserisci un messaggio da inviare a tutti i gruppi."
    }

    // Metodo di fallback per versioni precedenti di Baileys
    let chats = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
    let groups = chats.map(v => v[0]);

    if (groups.length === 0) {
        return m.reply("❌ Il bot non è presente in nessun gruppo.");
    }

    let successCount = 0;
    let errorCount = 0;
    let errorMessages = [];

    for (const jid of groups) {
        try {
            await conn.sendMessage(jid, {
                text: `*Messaggio dal proprietario:*\n\n${messageContent}`
            });
            successCount++;
        } catch (error) {
            console.error(`Errore nell'invio a ${jid}:`, error);
            errorCount++;
            errorMessages.push(`Errore nell'invio a ${jid}: ${error.message || error}`);
        }
    }

    let replyMessage = `✅ Messaggio inviato a ${successCount} gruppi.`;
    if (errorCount > 0) {
        replyMessage += `\n❌ Si sono verificati errori in ${errorCount} gruppi:\n${errorMessages.join('\n')}`;
    }

    m.reply(replyMessage);
};



handler.help = ["broad <messaggio>"];
handler.tags = ["owner"];
handler.command = /^broad$/i;
handler.rowner = true;

export default handler;