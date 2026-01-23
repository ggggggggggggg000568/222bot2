// AUTO-DELETE MESSAGESTUB PROMO/DEMOTE
// Cancella automaticamente i messaggi nativi di WhatsApp
// Tipo: ha dato i poteri / ha levato i poteri

const handler = async (m, { conn }) => {
    if (!m.messageStubType) return;

    const st = m.messageStubType;

    // Stubs:
    // 29 = PROMOTE
    // 30 = DEMOTE

    const stubsToDelete = [29, 30];

    if (stubsToDelete.includes(st)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (err) {
            console.log("Errore auto delete stub:", err);
        }
    }
};

export default handler;
