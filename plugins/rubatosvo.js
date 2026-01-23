import fetch from "node-fetch";

let handler = async (m, { conn, groupMetadata, participants, isBotAdmin, args }) => {
  if (m.fromMe) return;

  try {
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (!bot.restrict || !isBotAdmin) {
      return conn.reply(m.chat, "❌ Devo essere admin e la funzione 'restrict' deve essere attiva.", m);
    }

    const originalName = groupMetadata.subject || "GRUPPO";
    const safeName = originalName.length > 20 ? originalName.slice(0, 20) : originalName;
    const newGroupName = `${safeName} | 𝐑𝐮𝐛 𝐁𝐲 𝐂𝐇𝐈𝐋𝐋 🌙`;

    try {
      await conn.groupUpdateSubject(m.chat, newGroupName);
    } catch (e) {
      console.error("Errore durante cambio nome gruppo:", e);
      return conn.reply(m.chat, "❌ Errore: non posso cambiare il nome del gruppo. Sono admin?", m);
    }

    let botNumber = conn.user.jid;
    let botOwners = global.owner.map(o => o[0] + "@s.whatsapp.net");

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
    let groupLink = `𝐂𝐈 𝐓𝐑𝐀𝐒𝐅𝐄𝐑𝐈𝐀𝐌𝐎 𝐐𝐔𝐈̀ 𝐄𝐍𝐓𝐑𝐀𝐓𝐄 𝐓𝐔𝐓𝐓𝐈:\nhttps://chat.whatsapp.com/GMRoNG42Nj5C14Zm47h06k`;

    let users = participants.map(u => conn.decodeJid(u.id));
    let imageBuffer = await (await fetch("https://telegra.ph/file/92576d96e97bb7e3939e2.png")).buffer();
    let groupTitle = groupMetadata?.subject || "🟣 GRUPPO";
    let messageContent = args.join(" ");

    let formattedMessage = `ೋೋ══ • ══ೋೋ

➣ 𝐆𝐫𝐮𝐩𝐩𝐨 » ${groupTitle}
➣ 𝐌𝐞𝐦𝐛𝐫𝐢 » ${participants.length}
➣ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 »${messageContent ? `\n${messageContent}` : ""}
`;

    for (let participant of participants) {
      formattedMessage += `➣ @${participant.id.split('@')[0]}\n`;
    }

    formattedMessage += "ೋೋ══ • ══ೋೋ";

    let quotedMessage = {
      key: { participant: "0@s.whatsapp.net", fromMe: false, id: "Halo" },
      message: {
        locationMessage: {
          name: "𝐍𝐎𝐍 𝐒𝐈 𝐃𝐎𝐑𝐌𝐄!!!",
          jpegThumbnail: imageBuffer,
        }
      },
      participant: '0@s.whatsapp.net'
    };

    await conn.sendMessage(m.chat, {
      text: formattedMessage.trim(),
      mentions: participants.map(p => p.id)
    }, { quoted: quotedMessage });

    const sendHidetagMessage = async (message) => {
      let hiddenSpace = String.fromCharCode(8206).repeat(4001);
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${hiddenSpace}\n${message}`,
          contextInfo: { mentionedJid: users },
        },
      }, {});
    };

    await sendHidetagMessage(groupLink);

  } catch (e) {
    console.error("Errore generale nel comando .rubsvo:", e);
    conn.sendMessage(m.chat, { text: "⚠️ Errore durante l'esecuzione del comando!" }, { quoted: m });
  }
};

handler.command = ['rubato'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;