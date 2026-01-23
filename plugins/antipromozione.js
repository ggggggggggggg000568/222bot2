import fs from "fs";

const BOT_OWNER_JID = "393755649556@s.whatsapp.net"; // <-- METTI IL TUO NUMERO QUI!!!

function normalizeJid(jid) {
    return jid.replace(/:\d+/, "");
}

function getPromoter(m) {
    return m?.messageStubParameters?.[0] || m?.sender;
}

function getTarget(m) {
    return m?.messageStubParameters?.[1] || null;
}

const handler = async (m, { conn, groupMetadata }) => {
    if (m.messageStubType !== 29) return; // solo PROMOTE

    const groupName = groupMetadata.subject;

    const bot = normalizeJid(conn.user.id);
    const owner = normalizeJid(BOT_OWNER_JID);

    const promoter = normalizeJid(getPromoter(m));
    const target = normalizeJid(getTarget(m));

    if (!promoter || !target) return;

    // SE È IL BOT O L'OWNER → NON ATTIVARE PROTEZIONE
    if (promoter === bot || promoter === owner) return;

    const promoterMention = `@${promoter.split("@")[0]}`;
    const targetMention = `@${target.split("@")[0]}`;

    const protectMsg = `
┌──────────────────────────┐
│  🛡️　ＰＲＯＴＥＺＩＯＮＥ　ＡＴＴＩＶＡ　🛡️  │
└──────────────────────────┘

⛔ Promozione non autorizzata!

🧑‍⚖️ Utente bloccato:    ${promoterMention}
🎯 Bersaglio:            ${targetMention}
🏷️ Gruppo:               ${groupName}

🔧 Rimuovo gli admin non autorizzati...
`;

    await conn.sendMessage(m.chat, {
        text: protectMsg,
        mentions: [promoter, target]
    });

    // RIMUOVO ADMIN NON AUTORIZZATI
    try {
        await conn.groupParticipantsUpdate(m.chat, [promoter], "demote");
        await conn.groupParticipantsUpdate(m.chat, [target], "demote");
    } catch (e) {
        console.log("Errore nel demote:", e);
    }
};

export default handler;
