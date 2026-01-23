import fetch from "node-fetch"; 

let handler = async (m, { conn, groupMetadata, participants, isBotAdmin, args }) => {
    try {
        let bot = global.db.data.settings[conn.user.jid] || {};
        if (!bot.restrict || !isBotAdmin) return;

        let originalName = groupMetadata.subject;
        const newGroupName = `${originalName} | 𝐑𝐮𝐛 𝐁𝐲 𝐒𝐯𝐨²²² 𝐁𝚯𝐓 `;

        await conn.groupUpdateSubject(m.chat, newGroupName);

        let botNumber = conn.user.jid;
        
        let botOwners = owner.map(o => o[0] + "@s.whatsapp.net");

        let admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);
        let adminsToRemove = admins.filter(admin => !botOwners.includes(admin));

        for (let admin of adminsToRemove) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [admin], 'demote');
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.error(`Errore nella rimozione di ${admin}:`, err);
            }
        }

        await conn.groupSettingUpdate(m.chat, "announcement");

        let inviteCode = await conn.groupInviteCode(m.chat);
        let groupLink = `𝐂𝐈 𝐓𝐑𝐀𝐒𝐅𝐄𝐑𝐈𝐀𝐌𝐎 𝐐𝐔𝐈̀ 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈: 𝐒𝐯𝐨²²² 𝐁𝚯𝐓 <link da inserire nel file successivamente>`;

        let users = participants.map((u) => conn.decodeJid(u.id));
        let imageBuffer = await (await fetch("https://telegra.ph/file/92576d96e97bb7e3939e2.png")).buffer();
        let groupTitle = groupMetadata?.subject || "🟣 GRUPPO";
        let messageContent = args.join` `;

        let formattedMessage = `ೋೋ══ • ══ೋೋ

➣ 𝐆𝐫𝐮𝐩𝐩𝐨 » ${groupTitle}
➣ 𝐌𝐞𝐦𝐛𝐫𝐢 » ${participants.length}
➣ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 »${messageContent ? `\n${messageContent}` : ""}
ೋೋ══ • ══ೋೋ
`;

        for (let participant of participants) {
            formattedMessage += `➣ @${participant.id.split('@')[0]}\n`;
        }

        formattedMessage += "ೋೋ══ • ══ೋೋ";

        let quotedMessage = {
            key: { participant: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
            message: {
                locationMessage: {
                    name: "𝐒𝐯𝐨²²² 𝐁𝚯𝐓 RUB",
                    jpegThumbnail: imageBuffer,
                }
            },
            participant: '0@s.whatsapp.net'
        };

        await conn.sendMessage(m.chat, {
            text: formattedMessage.trim(),
            mentions: participants.map(p => p.id)
        }, {
            quoted: quotedMessage
        });

        const sendHidetagMessage = async (message) => {
            let more = String.fromCharCode(0);
            let hiddenSpace = more.repeat(0);
            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: `${hiddenSpace}\n${message}\n`,
                    contextInfo: { mentionedJid: users },
                },
            }, {});
        };

        await sendHidetagMessage(groupLink);

    } catch (e) {
        console.error(e);
        conn.sendMessage(m.chat, { text: "⚠️ Errore durante l'esecuzione del comando!" });
    }
};

handler.command = ['rubtest'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;