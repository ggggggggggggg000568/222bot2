const handler = async (m, { conn, args }) => {
  const mention = m.mentionedJid?.[0];
  const replyUser = m.quoted?.sender;
  const target = mention || replyUser || m.sender;
  const user = global.db.data.users[target];

  if (!user) return m.reply('❌ *Utente non trovato nel database.*');

  // Rimuovi eventuali tag dal testo
  const nomePulito = args.filter(arg => !arg.startsWith('@')).join(" ").trim();

  if (!nomePulito) {
    return m.reply(`📛 *Scrivi il nome da impostare!*\n\n📌 Esempio:\n.setnome Mario`);
  }

  if (nomePulito.length > 25) {
    return m.reply("❌ *Il nome è troppo lungo (massimo 25 caratteri).*");
  }

  user.name = nomePulito;

  const username = (await conn.getName(target)) || 'Utente';
  const mentionTag = [target];

  const messaggio = `📛 *Nome aggiornato con successo!*\n\n👤 *Utente:* @${target.split('@')[0]}\n🆕 *Nuovo nome:* *${nomePulito}*`;

  await conn.sendMessage(m.chat, { 
    text: messaggio,
    mentions: mentionTag 
  }, { quoted: m });
};

handler.help = ['setnome @user <nome>'];
handler.tags = ['owner'];
handler.command = /^(cambianome)$/i;
handler.owner = true;

export default handler;