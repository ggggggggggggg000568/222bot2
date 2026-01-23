import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Percorso whitelist
const whitelistPath = join(__dirname, 'whitelist.json');

let whitelist = [];
try {
  const data = readFileSync(whitelistPath, 'utf8');
  whitelist = JSON.parse(data);
} catch (e) {
  console.error('Errore caricando whitelist:', e);
}

let antiNukeEnabled = true;

function saveWhitelist() {
  try {
    writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2));
  } catch (e) {
    console.error('[ANTINUKE] Errore salvataggio whitelist:', e);
  }
}

// Funzione principale per gestire le modifiche admin sospette
async function handleAdminUpdate(m, { conn }) {
  if (!antiNukeEnabled || !m.isGroup) return;
  if (![29, 30].includes(m.messageStubType)) return;

  const actor = m.sender;
  const target = m.messageStubParameters?.[0];
  if (!actor || !target) return;

  const botJid = conn.user.jid;
  if (actor === botJid) return; // Ignora se il bot stesso fa la modifica

  const groupMetadata = await conn.groupMetadata(m.chat);
  const founder = groupMetadata.owner;

  // Prendi owner da global.owner in formato jid
  const ownerJids = (global.owner || []).map(o => o[0] + '@s.whatsapp.net');

  // Costruisci whitelist efficace: whitelist + owner + founder
  let effectiveWhitelist = [...new Set([...whitelist, ...ownerJids])];
  if (founder && !effectiveWhitelist.includes(founder)) effectiveWhitelist.push(founder);

  if (effectiveWhitelist.includes(actor)) return; // Se actor è autorizzato, esci

  // Controlla se bot è admin
  const botIsAdmin = groupMetadata.participants.some(p => p.id === botJid && p.admin);
  if (!botIsAdmin) return;

  const actorId = actor.split('@')[0];
  const targetId = target.split('@')[0];

  // Chiudi gruppo in modalità annuncio
  await conn.groupSettingUpdate(m.chat, 'announcement');

  // Avvisa gruppo e owner
  await conn.sendMessage(m.chat, {
    text: `🚨 *ANTI-RUB ATTIVO*\n\n👤 @${actorId} ha modificato @${targetId}.\n\n🔒 𝐠𝐫𝐮𝐩𝐩𝐨 𝐜𝐡𝐢𝐮𝐬𝐨 per 𝐬𝐯𝐭/𝐫𝐮𝐛.\n\n👑 Owner avvisati:\n${effectiveWhitelist.map(u => `> @${u.split('@')[0]}`).join('\n')}\n\n> ꜱɪꜱᴛᴇᴍᴀ ᴀɴᴛɪ - ʀᴜʙ ᴀᴛᴛɪᴠᴀᴛᴏ`,
    mentions: [actor, target, ...effectiveWhitelist]
  });

  // Demotion di admin non autorizzati (escluso founder e owner)
  const admins = groupMetadata.participants.filter(p => p.admin && p.id !== botJid);
  const toDemote = admins.filter(p => !effectiveWhitelist.includes(p.id) && p.id !== founder);

  for (let admin of toDemote) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [admin.id], 'demote');
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error('Errore durante demotion:', e);
    }
  }

  // 🔥🔥🔥 QUI HO INSERITO IL NUOVO MESSAGGIO DI PROMOZIONE 🔥🔥🔥
  for (let user of effectiveWhitelist) {
    const participant = groupMetadata.participants.find(p => p.id === user);
    if (participant && !participant.admin) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        await new Promise(r => setTimeout(r, 1000));

        // ====== NUOVO MESSAGGIO GRAFICO PROMOZIONE ======
        const number = user.split("@")[0];
        const promoter = m.sender.split("@")[0];
        const groupName = groupMetadata.subject;

        const promoMsg = `
┌──────────────────────────────┐
│   ＮＵＯＶＡ　ＰＲＯＭＯＺＩＯＮＥ   👑
└──────────────────────────────┘

🆙 *Utente promosso:* @${number}
👤 *Promosso da:* @${promoter}
💬 *Gruppo:* ${groupName}

👑 *L'utente ora possiede i poteri da amministratore.*
        `;

        await conn.sendMessage(m.chat, { 
          text: promoMsg,
          mentions: [user, m.sender]
        });

      } catch (e) {
        console.error('Errore durante promozione:', e);
      }
    }
  }
}

// Comandi per attivare/disattivare il sistema
async function enableAntiNuke(m, { conn }) {
  antiNukeEnabled = true;
  await conn.sendMessage(m.chat, { text: '✅ Sistema sicurezza ANTI-RUB attivato.' });
}

async function disableAntiNuke(m, { conn }) {
  antiNukeEnabled = false;
  await conn.groupSettingUpdate(m.chat, 'not_announcement');
  await conn.sendMessage(m.chat, { text: '🚫 Sistema sicurezza disattivato. Gruppo riaperto.' });
}

// Handler principale
const handler = {
  async before(m, { conn }) {
    if (!m.isGroup) return;

    await handleAdminUpdate(m, { conn });

    let text = m.text?.trim().toLowerCase();
    if (!text || !text.startsWith('!')) return;

    const groupMetadata = await conn.groupMetadata(m.chat);
    const founder = groupMetadata.owner;

    // Ottieni owner e costruisci whitelist efficace
    const ownerJids = (global.owner || []).map(o => o[0] + '@s.whatsapp.net');
    let effectiveWhitelist = [...new Set([...whitelist, ...ownerJids])];
    if (founder && !effectiveWhitelist.includes(founder)) effectiveWhitelist.push(founder);

    const isWhitelisted = effectiveWhitelist.includes(m.sender);

    if (text === '!antinuke on') {
      if (!isWhitelisted) return m.reply('❌ Non hai i permessi per attivare l\'AntiNuke.');
      return enableAntiNuke(m, { conn });
    }

    if (text === '!antinuke off') {
      if (!isWhitelisted) return m.reply('❌ Non hai i permessi per disattivare l\'AntiNuke.');
      return disableAntiNuke(m, { conn });
    }

    if (text === '!whitelist list') {
      const messaggio = whitelist.length > 0
        ? `📋 *Whitelist attuale:*\n${whitelist.map(u => `> @${u.split('@')[0]}`).join('\n')}`
        : '📭 Nessun numero in whitelist.';
      return conn.sendMessage(m.chat, { text: messaggio, mentions: whitelist }, { quoted: m });
    }

    if (text.startsWith('!whitelist add ')) {
      if (!isWhitelisted) return m.reply('❌ Non hai i permessi per aggiungere nella whitelist.');
      const numero = text.split(' ')[2];
      const jid = numero.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (!whitelist.includes(jid)) {
        whitelist.push(jid);
        saveWhitelist();
        return m.reply(`✅ Aggiunto @${numero} alla whitelist.`, null, { mentions: [jid] });
      } else {
        return m.reply(`ℹ️ @${numero} è già nella whitelist.`, null, { mentions: [jid] });
      }
    }

    if (text.startsWith('!whitelist remove ')) {
      if (!isWhitelisted) return m.reply('❌ Non hai i permessi per rimuovere dalla whitelist.');
      const numero = text.split(' ')[2];
      const jid = numero.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      if (whitelist.includes(jid)) {
        whitelist = whitelist.filter(j => j !== jid);
        saveWhitelist();
        return m.reply(`🗑️ Rimosso @${numero} dalla whitelist.`, null, { mentions: [jid] });
      } else {
        return m.reply(`⚠️ @${numero} non è nella whitelist.`, null, { mentions: [jid] });
      }
    }
  }
};

export default handler;
