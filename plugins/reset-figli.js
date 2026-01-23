const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const user = global.db.data.users[mention];

  if (!user) {
    return conn.reply(m.chat, 'Utente non trovato nel database.', m);
  }

  // Verifica che figli sia un array, poi svuota
  if (!Array.isArray(user.figli)) user.figli = [];
  const figliCount = user.figli.length;
  user.figli = [];

  conn.reply(
    m.chat,
    `✅ *Figli resettati con successo!*\n👶 ${figliCount} figli rimossi per @${mention.split('@')[0]}`,
    m,
    { mentions: [mention] }
  );
};

handler.command = ['resettafigli'];

handler.owner = true
export default handler;