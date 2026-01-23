const time = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, text, args, command }) => {
  const MAX_WARN = 3;
  const who = m.isGroup
    ? m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)
    : m.chat;

  if (!who) return m.reply('🚫 Tagga o rispondi a un utente.');

  global.db.data.users[who] = global.db.data.users[who] || { warn: 0 };
  const userData = global.db.data.users[who];
  const warnCount = userData.warn;

  const reason = text?.replace(/@\d+/, '').trim();
  const userMention = `@${who.split('@')[0]}`;
  
  // WARN
  if (command === 'warn' || command === 'ammonisci') {
    if (warnCount < MAX_WARN - 1) {
      userData.warn += 1;
      return conn.sendMessage(m.chat, { 
        text: `
╭━〔 ⚠️  AVVERTIMENTO ⚠️  〕━╮
┃ 👤 Utente: ${userMention}
┃ 🧾 Stato: ${userData.warn} / ${MAX_WARN}
┃ ✍️ Motivo: ${reason || '—'}
╰━━━━━━━━━━━━━━━━╯
        `.trim(),
        mentions: [who]
      });
    } else {
      userData.warn = 0;
      await conn.sendMessage(m.chat, { 
        text: `
╭━〔 ⛔ ESPULSO ⛔ 〕━╮
┃ 👤 Utente: ${userMention}
┃ 💣 Motivo: 3 avvertimenti
╰━━━━━━━━━━━━━╯
        `.trim(),
        mentions: [who]
      });
      await time(500);
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
    }
  }

  // UNWARN
  if (command === 'unwarn' || command === 'delwarn') {
    if (warnCount > 0) {
      userData.warn -= 1;
      return conn.sendMessage(m.chat, { 
        text: `
╭━〔 ✅ AVV. RIMOSSO ✅ 〕━╮
┃ 👤 Utente: ${userMention}
┃ 📉 Stato: ${userData.warn} / ${MAX_WARN}
╰━━━━━━━━━━━━━━━╯
        `.trim(),
        mentions: [who]
      });
    } else {
      return m.reply('🎩 L\'utente non ha avvertimenti attivi.');
    }
  }
};

handler.command = ['warn', 'ammonisci', 'unwarn', 'delwarn'];
handler.help = ['warn @utente [motivo]', 'unwarn @utente'];
handler.tags = ['moderation'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;