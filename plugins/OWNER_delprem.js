let handler = async (m, { conn, text }) => {
  let who;
  
  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text;
  } else {
    who = m.chat;
  }
  
  if (!who) {
    return m.reply('Devi specificare un utente.');
  }
  
  // Normalizza il numero per il confronto
  const normalizedWho = who.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  
  if (!global.prems.includes(normalizedWho.split('@')[0])) {
    return m.reply(
      `@${normalizedWho.split('@')[0]} non è un utente premium.`,
      null,
      { mentions: [normalizedWho] }
    );
  }
  
  // Trova e rimuovi l'utente dall'array premium
  let index = global.prems.findIndex(
    user => user.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === normalizedWho
  );
  
  if (index !== -1) {
    global.prems.splice(index, 1);
    
    let textdelprem = `@${normalizedWho.split('@')[0]} non è più utente premium`;
    m.reply(textdelprem, null, { mentions: [normalizedWho] });
  } else {
    m.reply('Utente non trovato nella lista premium.');
  }
};

handler.help = ['delprem <@user>'];
handler.tags = ['owner'];
handler.command = /^(remove|del)prem$/i;
handler.group = true;
handler.rowner = true;

export default handler;