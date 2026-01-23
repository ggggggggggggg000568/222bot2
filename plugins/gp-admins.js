const handler = async (m, { conn, participants, groupMetadata, args }) => {
  const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins
    .map((v, i) => `𖤍 ${i + 1}. @${v.id.split('@')[0]}`)
    .join('\n');

  const owner = groupMetadata.owner ||
    groupAdmins.find(p => p.admin === 'superadmin')?.id ||
    `${m.chat.split`-`[0]}@s.whatsapp.net`;

  const message = args.join(' ') || '⚠️ Nessun messaggio fornito.';

  // Messaggio fittizio tipo contatto "Admin"
  const msg = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "AdminAlert" },
    message: {
      contactMessage: {
        displayName: "Admin",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Admin;;;\nFN:Admin\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const testo = `
╭━━━❰ ⚠️ 𝐀𝐋𝐄𝐑𝐓 𝐀𝐃𝐌𝐈𝐍 ⚠️ ❱━━━╮

💬 *Messaggio inviato:*
> ${message}

👑 *Lista Admin del gruppo:*
${listAdmin}

╰━━━〔 📢 *ꪶ⃬𝟐𝟐𝟐ꫂ* 〕━━━╯
`.trim();

  await conn.reply(m.chat, testo, msg, {
    mentions: [...groupAdmins.map(v => v.id), owner]
  });
};

handler.command = ['admins', '@admins', 'dmins'];
handler.tags = ['group'];
handler.help = ['admins <messaggio>'];
handler.group = true;

export default handler;