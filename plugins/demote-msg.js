const handler = async (m, { conn, args, participants, groupMetadata }) => {
    if (!m.isGroup) return;
    if (!m.mentionedJid?.[0]) return m.reply("Tagga qualcuno!");

    const target = m.mentionedJid[0];
    const promoter = m.sender;
    const groupName = groupMetadata.subject;

    const targetMention = `@${target.split('@')[0]}`;
    const promoterMention = `@${promoter.split('@')[0]}`;

    const demoteMsg = `
┌──────────────────────────┐
│  ＤＥＣＬＡＳＳＡＭＥＮＴＯ  ⚠️  │
└──────────────────────────┘

🧍 Utente declassato:   ${targetMention}
🧑‍⚖️ Azione fatta da:   ${promoterMention}
🏷️ Gruppo:              ${groupName}

⬇️ L'utente ha perso i privilegi da amministratore.
`;

    await conn.groupParticipantsUpdate(m.chat, [target], "d");

    await conn.sendMessage(m.chat, {
        text: demoteMsg,
        mentions: [target, promoter]
    });
};

handler.help = ["d"];
handler.tags = ["group"];
handler.command = /^demote$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;
