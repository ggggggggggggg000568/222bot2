let running = false;

let handler = async (m, { conn, groupMetadata, participants, isBotAdmin, command }) => {
    if (!isBotAdmin) return m.reply("⚠️ Il bot deve essere amministratore per eseguire questo comando.");

    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    if (ps.length < 10) return m.reply("⚠️ Devono esserci almeno 10 membri nel gruppo per usare questo comando.");

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    running = true;

    if (command === 'confu') {
        m.reply("🌀 Inizio del caos...");

        while (running) {
            try {
                let selected = ps.sort(() => Math.random() - 0.5).slice(0, 3); // Max 3 utenti a ciclo
                m.reply(`⚙️ Promuovo: ${selected.map(u => `@${u.split('@')[0]}`).join(', ')}`, null, { mentions: selected });

                for (let user of selected) {
                    try { await conn.groupParticipantsUpdate(m.chat, [user], 'promote'); } catch { }
                    await delay(1000);
                }

                await delay(2000);

                m.reply(`🔻 Retrocedo: ${selected.map(u => `@${u.split('@')[0]}`).join(', ')}`, null, { mentions: selected });

                for (let user of selected) {
                    try { await conn.groupParticipantsUpdate(m.chat, [user], 'demote'); } catch { }
                    await delay(1000);
                }

                await delay(3000); // Aspetta prima del prossimo giro

            } catch (e) {
                console.error(e);
                m.reply(`⚠️ Errore grave: ${e.message}`);
                break;
            }
        }

        m.reply("🛑 Confusione interrotta.");
    } else if (command === 'smettila') {
        running = false;
        m.reply("😌 Ok, smetto di fare confusione.");
    }
};

handler.command = /^(confu|smettila)$/i;
handler.group = true;
handler.rowner = true;
handler.botAdmin = true;

export default handler;
