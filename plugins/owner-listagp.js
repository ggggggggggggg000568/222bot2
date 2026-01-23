import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn, isOwner }) => {
  // Check user permission
  if (!isOwner) return m.reply('❌ Solo il proprietario può usare questo comando!');

  // Fetch all groups
  const groups = Object.values(await conn.groupFetchAllParticipating());

  // Prepare header
  let txt = `𝐋𝐈𝐒𝐓𝐀 𝐃𝐄𝐈 𝐆𝐑𝐔𝐏𝐏𝐈 𝐃𝐈 ꙰ 777 ꙰ 𝔹𝕆𝕋 ꙰\n\n`;
  txt += `➣ 𝐓𝐨𝐭𝐚𝐥𝐞 𝐆𝐫𝐮𝐩𝐩𝐢: ${groups.length}\n\n`;

  // Loop through groups
  for (const [index, group] of groups.entries()) {
    const groupName = group.subject;
    const participants = group.participants.length;
    const groupId = group.id;

    // Check if the bot is an admin
    const botNumber = conn.user.jid; // Ottieni l'ID del bot
    const admins = group.participants.filter((p) => p.admin === 'admin' || p.admin === 'superadmin');
    const isBotAdmin = admins.some((admin) => admin.id === botNumber) ? '✓' : '☓';

    // Generate invite link if the bot is admin
    let inviteLink = 'Non sono admin';
    if (isBotAdmin === '✓') {
      try {
        const code = await conn.groupInviteCode(group.id);
        inviteLink = `https://chat.whatsapp.com/${code}`;
      } catch (err) {
        inviteLink = 'Errore nel generare il link';
      }
    }

    txt += `══════ ೋೋ══════\n`;
    txt += `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ 𝐍𝐔𝐌𝚵𝐑Ꮻ: ${index + 1}\n`;
    txt += `➣ 𝐆𝐑𝐔𝐏𝐏Ꮻ: ${groupName}\n`;
    txt += `➣ 𝐏𝚲𝐑𝐓𝚵𝐂𝕀𝐏𝚲𝐍𝐓𝕐: ${participants}\n`;
    txt += `➣ 𝚲𝐃𝐌𝕀𝐍: ${isBotAdmin}\n`;
    txt += `➣ 𝕀𝐃: ${groupId}\n`;
    txt += `➣ 𝐋𝕀𝐍𝐊: ${inviteLink}\n\n`; // Aggiunto spazio tra i gruppi
  }

  // Send result
  m.reply(txt.trim());
};

handler.help = ['listagruppi', 'grouplist'];
handler.tags = ['info'];
handler.command = /^(listagruppi|gplist|listgp|grouplist)$/i;
handler.owner = true;
export default handler;
