let richiesteInSospeso = {};

// Intercetta le richieste di partecipazione
global.conn.ev.on('group-request.update', async (update) => {
    if (!update || !update.id || !update.requests) return;
    richiesteInSospeso[update.id] = update.requests;
    console.log(`>> Rilevate ${update.requests.length} richieste nel gruppo ${update.id}`);
});

let handler = async (m, { conn }) => {
    const richieste = richiesteInSospeso[m.chat] || [];

    if (!richieste.length) {
        return m.reply('🤖 Nessuna richiesta di partecipazione trovata.');
    }

    let accettati = 0;
    for (let r of richieste) {
        try {
            // Usa 'groupParticipantsUpdate' per accettare le richieste
            await conn.groupParticipantsUpdate(m.chat, [r.participant], 'add');
            accettati++;
        } catch (e) {
            console.error(`❌ Errore accettando ${r.participant}:`, e);
        }
    }

    richiesteInSospeso[m.chat] = []; // svuota richieste salvate

    m.reply(`✅ Ho accettato ${accettati} richiesta(e) di partecipazione.`);
};

handler.command = /^(accettatutti|accetta)$/i;
handler.group = true;
handler.admin = true;

export default handler;