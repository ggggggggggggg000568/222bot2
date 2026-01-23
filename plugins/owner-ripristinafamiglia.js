const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const user = global.db.data.users[mention];

  if (!user) {
    return conn.reply(m.chat, 'Utente non trovato nel database.', m);
  }

  const oldFigli = user._oldFigli || [];
  const oldEx = user._oldEx || [];
  const oldConiuge = user._oldConiuge;

  if (
    oldFigli.length === 0 &&
    oldEx.length === 0 &&
    !oldConiuge
  ) {
    return conn.reply(m.chat, '⚠️ Nessun dato famiglia precedente trovato da ripristinare.', m);
  }

  // Ripristina
  user.figli = [...oldFigli];
  user.ex = [...oldEx];
  user.coniuge = oldConiuge || null;
  user.sposato = !!oldConiuge;

  // Cancella i backup
  user._oldFigli = [];
  user._oldEx = [];
  user._oldConiuge = null;

  const mentions = [...oldFigli, ...oldEx];
  if (oldConiuge) mentions.push(oldConiuge);

  conn.reply(
    m.chat,
    `✅ *Famiglia ripristinata con successo!*\n👩‍❤️‍👨 Coniuge: ${oldConiuge ? '@' + oldConiuge.split('@')[0] : 'nessuno'}\n💞 Ex: ${oldEx.length > 0 ? oldEx.map(j => '@' + j.split('@')[0]).join(', ') : 'nessuno'}\n👶 Figli: ${oldFigli.length > 0 ? oldFigli.map(j => '@' + j.split('@')[0]).join(', ') : 'nessuno'}`,
    m,
    { mentions }
  );
};

handler.command = ['ripristinafamiglia'];
export default handler;