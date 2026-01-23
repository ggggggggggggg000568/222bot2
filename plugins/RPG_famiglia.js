const handler = async (m, { conn }) => {
  const mention = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  const who = mention;

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {};
  }

  const user = global.db.data.users[who];

  // Inizializza proprietà mancanti
  if (!user.ex) user.ex = [];
  if (!user.figli) user.figli = [];

  const exList = user.ex.length > 0 ? user.ex.map(jid => `• @${jid.split("@")[0]}`).join('\n') : '— nessuno —';
  const figliList = user.figli.length > 0 ? user.figli.map(jid => `• @${jid.split("@")[0]}`).join('\n') : '— nessuno —';

  const coniugeText = user.coniuge ? `@${user.coniuge.split('@')[0]}` : '— nessuno —';
  const sposatoText = user.sposato ? '💍 Sì' : '❌ No';

  const nameText = user.name && user.name.trim() !== '' ? user.name : 'Sconosciuto';

  const text = `
╔════════════╗
║    𝐏𝐫𝐨𝐟𝐢𝐥𝐨 𝐅𝐚𝐦𝐢𝐠𝐥𝐢𝐚𝐫𝐞    ║
╚════════════╝

> 👤 𝐍𝐨𝐦𝐞: ${nameText}

💍 𝐒𝐩𝐨𝐬𝐚𝐭𝐨/𝐚: ${sposatoText}
🤵 𝐂𝐨𝐧𝐢𝐮𝐠𝐞: ${coniugeText}

💔 𝐄𝐱 𝐂𝐨𝐧𝐢𝐮𝐠𝐢:
${exList}

👶 𝐅𝐢𝐠𝐥𝐢:
${figliList}
`;

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      mentionedJid: [
        ...(user.coniuge ? [user.coniuge] : []),
        ...user.ex,
        ...user.figli
      ]
    }
  });
};

handler.command = ['famiglia'];
export default handler;