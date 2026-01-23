import { proto } from '@whiskeysockets/baileys';

const WHITELIST = new Set([
  'tuoid1@s.whatsapp.net',  // metti gli ID admin autorizzati qui
  'tuoid2@s.whatsapp.net',
]);

async function isAdminOrOwner(conn, chatId, userId) {
  try {
    const meta = await conn.groupMetadata(chatId);
    const participant = meta.participants.find(p => p.id === userId);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
  } catch {
    return false;
  }
}

async function antirubHandler(update, conn) {
  if (!update.key.remoteJid) return;
  const chatId = update.key.remoteJid;

  if (!global.db.data.chats[chatId]?.antirub) return; // Se non attivo skip

  const userChanged = update.participant;
  const actor = update.actor;

  if (!actor) return;

  if (WHITELIST.has(actor) || await isAdminOrOwner(conn, chatId, actor)) {
    // autorizzato
    return;
  }

  if (update.action === 'promote') {
    // rimuovo admin a chi ha promosso e a chi è stato promosso
    await conn.groupDemoteAdmin(chatId, userChanged);
    await conn.groupDemoteAdmin(chatId, actor);
    await conn.sendMessage(chatId, { text: `⚠️ Utente non autorizzato (${actor}) ha promosso admin (${userChanged}). Admin rimossi.` });
  } else if (update.action === 'demote') {
    // rimuovo admin solo a chi ha fatto la rimozione
    await conn.groupDemoteAdmin(chatId, actor);
    await conn.sendMessage(chatId, { text: `⚠️ Utente non autorizzato (${actor}) ha rimosso admin. Admin rimosso a lui.` });
  }
}

export { antirubHandler };