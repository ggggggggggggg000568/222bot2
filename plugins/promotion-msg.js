const handler = async (m, { conn, args, participants, groupMetadata }) => {
    if (!m.isGroup) return;
    if (!m.mentionedJid?.[0]) return m.reply("Tagga qualcuno!");

    const target = m.mentionedJid[0];
    const promoter = m.sender;
    const groupName = groupMetadata.subject;

    const targetMention = `@${target.split('@')[0]}`;
    const promoterMention = `@${promoter.split('@')[0]}`;

    const promoMsg = `
┌──────────────────────────┐
│  ＮＵＯＶＡ　ＰＲＯＭＯＺＩＯＮＥ  👑  │
└──────────────────────────┘

🧍 Utente promosso:     ${targetMention}
🧑‍⚖️ Promosso da:        ${promoterMention}
🏷️ Gruppo:              ${groupName}

✨ L'utente ora possiede i poteri da amministratore.
`;

    await conn.groupParticipantsUpdate(m.chat, [target], "promote");

    await conn.sendMessage(m.chat, {
        text: promoMsg,
        mentions: [target, promoter]
    });
};

handler.help = ["p"];
handler.tags = ["group"];
handler.command = /^p$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;
