const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const user = global.db.data.users[mention];

  if (!user) {
    return conn.reply(m.chat, 'Utente non trovato nel database.', m);
  }

  // Backup (opzionale, rimuovilo se non ti serve)
  user._oldFigli = [...(user.figli || [])];
  user._oldEx = [...(user.ex || [])];
  user._oldConiuge = user.coniuge;

  // Reset valori
  user.figli = [];
  user.ex = [];
  user.coniuge = null;
  user.sposato = false;

  conn.reply(
    m.chat,
    `💔 *Profilo famiglia resettato con successo!*\nTutti i dati familiari sono stati rimossi per @${mention.split('@')[0]}.`,
    m,
    { mentions: [mention] }
  );
};

handler.command = ['resettafamiglia'];
handler.owner = true
export default handler;