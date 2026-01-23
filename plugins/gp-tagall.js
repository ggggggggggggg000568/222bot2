let handler = async (m, { isOwner, isAdmin, conn, text, participants, groupMetadata }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    // Messaggio personalizzabile
    let msg = text || '🔥 Tutti online subito! 🔥';

    // Nuova grafica con font unicode
    let teks = `
┏━━━━━━━━━━┓
    ✨ 𝙏𝘼𝙂 𝘼𝙇𝙇 ✨
┗━━━━━━━━━━┛

🏷️ 𝙂𝙧𝙪𝙥𝙥𝙤: 『 ${groupMetadata.subject} 』
💬 𝙈𝙚𝙨𝙨𝙖𝙜𝙜𝙞𝙤: ${msg}

👥 𝙈𝙚𝙢𝙗𝙧𝙞:
${participants.map((v, i) => `➤ ${i + 1}) @${v.id.split('@')[0]}`).join('\n')}

────────────────────
🚀 ꪶ⃬𝟐𝟐𝟐ꫂ 𝘽𝙤𝙩
`;

    await conn.sendMessage(m.chat, {
        text: teks,
        mentions: participants.map(v => v.id)
    });
};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = /^(tagall|marcar)$/i;
handler.group = true;

export default handler;