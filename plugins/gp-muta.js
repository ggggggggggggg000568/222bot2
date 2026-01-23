// =============================
// 🔧 MUTARE / SMUTARE – BOTTONI FUNZIONANTI
// =============================

const handler = async (message, { conn, command, args }) => {
  const chatId = message.chat;

  // =============================
  // 🔥 FUNZIONI UTILITY
  // =============================
  const normalizeJid = (jid) => {
    if (!jid) return "";
    let str = jid.toString();
    str = str.split("@")[0];
    str = str.split(":")[0];
    str = str.replace(/[^0-9]/g, "");
    return str ? str + "@s.whatsapp.net" : "";
  };

  const extractNumber = (jid) => {
    if (!jid) return "";
    return jid.toString().split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
  };

  // =============================
  // 🔥 CHECK ADMIN
  // =============================
  const groupMetadata = await conn.groupMetadata(chatId);
  const senderNumber = extractNumber(message.sender);

  let senderIsAdmin = false;
  for (const p of groupMetadata.participants) {
    const possibleIds = [p.id, p.jid, p.number, p.phone, p.lid].filter(Boolean);
    const foundSender = possibleIds.some(id => extractNumber(id) === senderNumber);
    if (foundSender && (p.admin === "admin" || p.admin === "superadmin" || p.admin)) {
      senderIsAdmin = true;
      break;
    }
  }

  if (!senderIsAdmin) {
    return conn.reply(chatId, "ⓘ Solo un amministratore può eseguire questo comando 👑", message);
  }

  // =============================
  // 🎯 TROVA UTENTE TARGET
  // =============================
  let mentionedUser = null;

  if (message.mentionedJid && message.mentionedJid[0]) {
    mentionedUser = normalizeJid(message.mentionedJid[0]);
  } else if (message.quoted?.sender) {
    mentionedUser = normalizeJid(message.quoted.sender);
  } else if (args[0]) {
    const num = args[0].replace(/[^0-9]/g, "");
    if (num.length >= 6) mentionedUser = num + "@s.whatsapp.net";
  }

  if (!mentionedUser) {
    return conn.reply(
      chatId,
      command === "muta"
        ? "ⓘ Tagga la persona o rispondi al suo messaggio per mutare 👤"
        : "ⓘ Tagga la persona o rispondi al suo messaggio per smutare 👤",
      message
    );
  }

  // =============================
  // 🚫 Protezioni
  // =============================
  const senderJid = normalizeJid(message.sender);
  const groupOwner = normalizeJid(groupMetadata.owner);
  const botJid = normalizeJid(conn.user?.jid || conn.user?.id);

  if (mentionedUser === groupOwner && groupOwner)
    return conn.reply(chatId, "ⓘ Il proprietario del gruppo non può essere mutato 👑", message);

  if (mentionedUser === botJid)
    return conn.reply(chatId, "ⓘ Non puoi mutare il bot 🤖", message);

  const targetNumber = extractNumber(mentionedUser);
  let targetIsAdmin = false;
  for (const p of groupMetadata.participants) {
    const possibleIds = [p.id, p.jid, p.number, p.phone, p.lid].filter(Boolean);
    const found = possibleIds.some(id => extractNumber(id) === targetNumber);
    if (found && (p.admin === "admin" || p.admin === "superadmin" || p.admin)) {
      targetIsAdmin = true;
      break;
    }
  }

  // =============================
  // 🔇 LOGICA MUTARE / SMUTARE
  // =============================
  if (!global.db.data.users[mentionedUser])
    global.db.data.users[mentionedUser] = {};

  const userData = global.db.data.users[mentionedUser];
  const alreadyMuted = userData.muto === true;

  if (command === "muta" && alreadyMuted)
    return conn.reply(chatId, "ⓘ Questo utente è già mutato 🔇", message);

  if (command === "smuta" && !alreadyMuted)
    return conn.reply(chatId, "ⓘ Questo utente non è mutato 🔊", message);

  userData.muto = command === "muta";

  // =============================
  // 📨 MESSAGGIO CON BOTTONE
  // =============================
  const emoji = command === "muta" ? "🔇" : "🔊";
  const action = command === "muta" ? "mutato" : "smutato";
  const oppositeCommand = command === "muta" ? "smuta" : "muta";
  const oppositeLabel = command === "muta" ? "Smuta 🔊" : "Muta 🔇";

  const buttonId = `${oppositeCommand}_${mentionedUser}`;

  const testo = `╭─⊷ *AZIONE ESEGUITA*
│
│ • ${emoji} @${mentionedUser.split("@")[0]} è stato ${action}
│ • Eseguito da: @${senderJid.split("@")[0]}
│
╰─────────────`;

  // Salva dati per il bottone
  global.db.data.muteButtons = global.db.data.muteButtons || {};
  global.db.data.muteButtons[buttonId] = {
    target: mentionedUser,
    action: oppositeCommand,
    chat: chatId
  };

  // Invia con bottone interattivo
  await conn.sendMessage(chatId, {
    text: testo,
    footer: "Clicca il bottone sotto per invertire l'azione",
    mentions: [mentionedUser, senderJid],
    buttons: [
      {
        buttonId: buttonId,
        buttonText: { displayText: oppositeLabel },
        type: 1
      }
    ],
    headerType: 1
  });
};


// =============================
// 🔥 HANDLER BOTTONI
// =============================
handler.before = async (m, { conn }) => {
  // Intercetta risposta bottone
  const buttonResponse = m?.message?.buttonsResponseMessage;
  const templateResponse = m?.message?.templateButtonReplyMessage;
  
  const selectedId = buttonResponse?.selectedButtonId || templateResponse?.selectedId;
  
  if (!selectedId) return;
  if (!selectedId.startsWith("muta_") && !selectedId.startsWith("smuta_")) return;

  const buttonData = global.db.data.muteButtons?.[selectedId];
  if (!buttonData) return;

  const chatId = m.chat;
  const mentionedUser = buttonData.target;
  const command = buttonData.action;

  // =============================
  // 🔥 FUNZIONI UTILITY
  // =============================
  const extractNumber = (jid) => {
    if (!jid) return "";
    return jid.toString().split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
  };

  const normalizeJid = (jid) => {
    if (!jid) return "";
    let str = jid.toString().split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
    return str ? str + "@s.whatsapp.net" : "";
  };

  // =============================
  // 🔥 CHECK ADMIN
  // =============================
  const groupMetadata = await conn.groupMetadata(chatId);
  const senderNumber = extractNumber(m.sender);

  let senderIsAdmin = false;
  for (const p of groupMetadata.participants) {
    const possibleIds = [p.id, p.jid, p.number, p.phone, p.lid].filter(Boolean);
    const found = possibleIds.some(id => extractNumber(id) === senderNumber);
    if (found && (p.admin === "admin" || p.admin === "superadmin" || p.admin)) {
      senderIsAdmin = true;
      break;
    }
  }

  if (!senderIsAdmin) {
    return conn.reply(chatId, "ⓘ Solo un amministratore può cliccare questo bottone 👑", m);
  }

  // =============================
  // 🎯 ESEGUI AZIONE
  // =============================
  if (!global.db.data.users[mentionedUser])
    global.db.data.users[mentionedUser] = {};

  const userData = global.db.data.users[mentionedUser];
  const alreadyMuted = userData.muto === true;

  if (command === "muta" && alreadyMuted) {
    return conn.reply(chatId, "ⓘ Questo utente è già mutato 🔇", m);
  }

  if (command === "smuta" && !alreadyMuted) {
    return conn.reply(chatId, "ⓘ Questo utente non è mutato 🔊", m);
  }

  // Esegui azione
  userData.muto = command === "muta";

  // Rimuovi vecchio bottone
  delete global.db.data.muteButtons[selectedId];

  const senderJid = normalizeJid(m.sender);
  const emoji = command === "muta" ? "🔇" : "🔊";
  const action = command === "muta" ? "mutato" : "smutato";
  const newOppositeCommand = command === "muta" ? "smuta" : "muta";
  const newOppositeLabel = command === ".muta" ? ".Smuta 🔊" : ".Muta 🔇";
  const newButtonId = `${newOppositeCommand}_${mentionedUser}`;

  const testo = `╭─⊷ *AZIONE ESEGUITA*
│
│ • ${emoji} @${mentionedUser.split("@")[0]} è stato ${action}
│ • Eseguito da: @${senderJid.split("@")[0]}
│
╰─────────────`;

  // Salva nuovo bottone
  global.db.data.muteButtons[newButtonId] = {
    target: mentionedUser,
    action: newOppositeCommand,
    chat: chatId
  };

  // Invia nuovo messaggio con bottone
  await conn.sendMessage(chatId, {
    text: testo,
    footer: "Clicca il bottone sotto per invertire l'azione",
    mentions: [mentionedUser, senderJid],
    buttons: [
      {
        buttonId: newButtonId,
        buttonText: { displayText: newOppositeLabel },
        type: 1
      }
    ],
    headerType: 1
  });
};


handler.command = /^(muta|smuta)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;