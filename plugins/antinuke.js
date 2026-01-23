import { readFileSync, writeFileSync } from 'fs'; 
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

// 1. INIZIALIZZAZIONE WHITELIST 
const whitelistPath = join(__dirname, 'whitelists.json'); 
let whitelists = {}; // Struttura: { "gruppo1": ["user1", ...], ... }

try { 
    const data = readFileSync(whitelistPath, 'utf8'); 
    whitelists = JSON.parse(data); 
    console.log('[ANTINUKE] Whitelists caricate correttamente'); 
} catch (e) { 
    if (e.code === 'ENOENT') { 
        writeFileSync(whitelistPath, '{}'); 
        console.log('[ANTINUKE] File whitelists.json creato'); 
    } else { 
        console.error('[ANTINUKE] Errore caricamento whitelists:', e); 
    } 
}

let antiNukeEnabled = true;

// 2. FUNZIONI DI SUPPORTO 
function saveWhitelists() { 
    try { 
        writeFileSync(whitelistPath, JSON.stringify(whitelists, null, 2)); 
    } catch (e) { 
        console.error('[ANTINUKE] Errore salvataggio whitelists:', e); 
    } 
}

// Funzione per normalizzare JID (importante!)
function normalizeJid(jid) {
    if (!jid) return jid;
    // Rimuove eventuali suffissi come :number@s.whatsapp.net
    return jid.replace(/:(\d+)@s\.whatsapp\.net$/, '@s.whatsapp.net');
}

async function getEffectiveWhitelist(conn, groupId) { 
    try { 
        const metadata = await conn.groupMetadata(groupId); 
        const founder = normalizeJid(metadata.owner);
        const globalOwners = (global.owner || []).map(o => `${normalizeJid(o[0])}@s.whatsapp.net`);
        const groupWhitelist = (whitelists[groupId] || []).map(normalizeJid);

        return [...new Set([...groupWhitelist, ...globalOwners, founder])];
    } catch (e) { 
        console.error('[ANTINUKE] Errore recupero whitelist per gruppo', groupId, e); 
        return []; 
    } 
}

// 3. EVENTO ANTINUKE SU PROMOTE/DEMOTE 
function setupAntiNuke(conn) { 
    conn.ev.on('group-participants.update', async (update) => { 
        const { id: groupId, participants, action, actor } = update;

        console.log('[ANTINUKE] Evento ricevuto:', { groupId, action, actor });

        if (!antiNukeEnabled) {
            console.log('[ANTINUKE] Sistema disattivato');
            return;
        }
        
        if (!['promote', 'demote'].includes(action)) {
            console.log('[ANTINUKE] Azione non rilevante:', action);
            return;
        }
        
        if (!actor) {
            console.log('[ANTINUKE] Nessun attore specificato');
            return;
        }

        // Normalizza l'actor JID
        const normalizedActor = normalizeJid(actor);
        if (normalizedActor === normalizeJid(conn.user.jid)) {
            console.log('[ANTINUKE] Azione eseguita dal bot, ignorando');
            return;
        }

        try {
            const effectiveWhitelist = await getEffectiveWhitelist(conn, groupId);
            const normalizedWhitelist = effectiveWhitelist.map(normalizeJid);

            console.log('[ANTINUKE] Whitelist efficace:', normalizedWhitelist);
            console.log('[ANTINUKE] Attore normalizzato:', normalizedActor);

            // Se l'attore è whitelist, ignora
            if (normalizedWhitelist.includes(normalizedActor)) {
                console.log('[ANTINUKE] Attore è in whitelist, azione permessa');
                return;
            }

            console.log('[ANTINUKE] ⚠️ ATTENZIONE: Azione sospetta rilevata!');

            const metadata = await conn.groupMetadata(groupId);
            const botIsAdmin = metadata.participants.some(p => 
                normalizeJid(p.id) === normalizeJid(conn.user.jid) && p.admin
            );
            
            if (!botIsAdmin) {
                console.log('[ANTINUKE] Bot non è admin, impossibile intervenire');
                return;
            }

            // 🔒 Blocca il gruppo
            await conn.groupSettingUpdate(groupId, 'announcement');
            await conn.sendMessage(groupId, {
                text: `🚨 *ANTI-NUKE ATTIVATO*\n@${normalizedActor.split('@')[0]} ha tentato un'azione sospetta!\n🔒 Gruppo bloccato.`,
                mentions: [normalizedActor]
            });

            // 👇 Demote non-whitelist
            const admins = metadata.participants.filter(p => 
                p.admin && normalizeJid(p.id) !== normalizeJid(conn.user.jid)
            );
            
            const toDemote = admins.filter(p => 
                !normalizedWhitelist.includes(normalizeJid(p.id))
            );
            
            console.log('[ANTINUKE] Admin da demotare:', toDemote.length);
            
            for (const admin of toDemote) {
                try {
                    await conn.groupParticipantsUpdate(groupId, [admin.id], 'demote');
                    console.log(`[ANTINUKE] Demotato: ${admin.id}`);
                    await new Promise(r => setTimeout(r, 1000));
                } catch (error) {
                    console.error('[ANTINUKE] Errore nel demote:', error);
                }
            }

            // 👑 Promote whitelist
            const whitelistToPromote = normalizedWhitelist.filter(jid =>
                !metadata.participants.find(p => 
                    normalizeJid(p.id) === jid && p.admin
                )
            );
            
            console.log('[ANTINUKE] Whitelist da promuovere:', whitelistToPromote.length);
            
            for (const user of whitelistToPromote) {
                try {
                    await conn.groupParticipantsUpdate(groupId, [user], 'promote');
                    console.log(`[ANTINUKE] Promosso: ${user}`);
                    await new Promise(r => setTimeout(r, 1000));
                } catch (error) {
                    console.error('[ANTINUKE] Errore nel promote:', error);
                }
            }

        } catch (e) {
            console.error('[ANTINUKE] Errore gestione update partecipanti:', e);
        }
    }); 
}

// 4. COMANDI 
const handler = { 
    async before(m, { conn }) { 
        if (!m.isGroup || !m.text?.startsWith('!')) return;

        const [cmd, ...args] = m.text.trim().slice(1).toLowerCase().split(' ');
        const groupId = m.chat;
        const senderJid = normalizeJid(m.sender);

        try {
            const effectiveWhitelist = await getEffectiveWhitelist(conn, groupId);
            const normalizedWhitelist = effectiveWhitelist.map(normalizeJid);

            const isAllowed = normalizedWhitelist.includes(senderJid);
            const isGlobalOwner = (global.owner || []).some(o => 
                normalizeJid(`${o[0]}@s.whatsapp.net`) === senderJid
            );

            switch (cmd) {
                case 'antinuke':
                    if (!isAllowed) return m.reply('❌ Permessi insufficienti.');
                    if (args[0] === 'on' || args[0] === 'off') {
                        antiNukeEnabled = args[0] === 'on';
                        await conn.sendMessage(groupId, {
                            text: `⚙️ Anti-Nuke ${antiNukeEnabled ? 'ATTIVATO' : 'DISATTIVATO'}` +
                                  (antiNukeEnabled ? '' : '\n🔓 Gruppo riaperto.')
                        });
                        if (!antiNukeEnabled) await conn.groupSettingUpdate(groupId, 'not_announcement');
                    } else {
                        m.reply(`ℹ️ Stato Anti-Nuke: ${antiNukeEnabled ? 'ATTIVATO' : 'DISATTIVATO'}`);
                    }
                    break;

                case 'whitelist':
                    if (!isAllowed) return m.reply('❌ Solo per utenti in whitelist.');
                    switch (args[0]) {
                        case 'list':
                            const list = (whitelists[groupId] || []).map(normalizeJid);
                            m.reply(
                                `📜 Whitelist (${list.length}):\n${list.map(u => `▸ @${u.split('@')[0]}`).join('\n') || "Vuota"}`,
                                null, { mentions: list }
                            );
                            break;
                        case 'add':
                            const numToAdd = args[1]?.replace(/\D/g, '');
                            if (!numToAdd) return m.reply('❌ Specifica un numero.');
                            const jidToAdd = normalizeJid(`${numToAdd}@s.whatsapp.net`);
                            if (!whitelists[groupId]) whitelists[groupId] = [];
                            if (whitelists[groupId].includes(jidToAdd)) {
                                m.reply(`ℹ️ @${numToAdd} già in whitelist.`, null, { mentions: [jidToAdd] });
                            } else {
                                whitelists[groupId].push(jidToAdd);
                                saveWhitelists();
                                m.reply(`✅ @${numToAdd} aggiunto alla whitelist!`, null, { mentions: [jidToAdd] });
                            }
                            break;
                        case 'remove':
                            const numToRemove = args[1]?.replace(/\D/g, '');
                            if (!numToRemove) return m.reply('❌ Specifica un numero.');
                            const jidToRemove = normalizeJid(`${numToRemove}@s.whatsapp.net`);
                            if (whitelists[groupId]?.includes(jidToRemove)) {
                                whitelists[groupId] = whitelists[groupId].filter(j => j !== jidToRemove);
                                saveWhitelists();
                                m.reply(`🗑️ @${numToRemove} rimosso dalla whitelist!`, null, { mentions: [jidToRemove] });
                            } else {
                                m.reply(`⚠️ @${numToRemove} non trovato nella whitelist.`, null, { mentions: [jidToRemove] });
                            }
                            break;
                        case 'reset':
                            whitelists[groupId] = [];
                            saveWhitelists();
                            m.reply('♻️ Whitelist resettata!');
                            break;
                        case 'showall':
                            if (!isGlobalOwner) return m.reply('❌ Solo per owner globali.');
                            m.reply(
                                `📂 Tutte le whitelist:\n${Object.entries(whitelists)
                                .map(([g, users]) => `\n▸ ${g.split('@')[0]}\n${users.map(u => `  ▸ @${u.split('@')[0]}`).join('\n')}`)
                                .join('\n') || "Nessuna whitelist"}`,
                                null, { mentions: Object.values(whitelists).flat() }
                            );
                            break;
                        default:
                            m.reply('❌ Sottocomando non riconosciuto. Usa: list, add, remove, reset');
                            break;
                    }
                    break;
            }
        } catch (e) {
            console.error('[ANTINUKE] Errore elaborazione comando:', e);
            m.reply('❌ Si è verificato un errore durante l\'elaborazione del comando.');
        }
    },
    setupAntiNuke 
};

export default handler;