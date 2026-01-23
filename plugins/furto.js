
const handler = async (m, { conn, command, text, args }) => {
  const mention = m.mentionedJid?.[0];
  const thief = m.sender;

  if (!mention) return conn.reply(m.chat, "*Tagga l'utente da derubare!*", m);
  if (mention === thief) return conn.reply(m.chat, "*Non puoi rubare da te stesso!*", m);

  // Inizializzazione utenti se non esistono
  if (!global.db.data.users[thief]) {
    global.db.data.users[thief] = {
      money: 0, bank: 0, lvl: 0, messaggi: 0, furti: 0, datafurto: "Mai", rubati: 0
    };
  }

  if (!global.db.data.users[mention]) {
    global.db.data.users[mention] = {
      money: 0, bank: 0, lvl: 0, messaggi: 0, furti: 0, datafurto: "Mai", rubati: 0
    };
  }

  const ladro = global.db.data.users[thief];
  const vittima = global.db.data.users[mention];

  if (vittima.money <= 0) return conn.reply(m.chat, "*La vittima non ha contanti da rubare!*", m);

  const maxRubabile = Math.floor(vittima.money * 0.5);
  const successo = Math.random() < 0.5;

  const prova = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: "𝐅𝐔𝐑𝐓𝐎 🥷",
        vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${mention.split("@")[0]}:${mention.split("@")[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  if (successo) {
    const rubato = Math.floor(Math.random() * maxRubabile) + 1;
    vittima.money -= rubato;
    ladro.money += rubato;
    ladro.furti += 1;
    ladro.datafurto = new Date().toLocaleString("it-IT");
    ladro.rubati += rubato;

    const testo = 
      `═════ ೋೋ═════\n` +
      `+ 𝐅𝐔𝐑𝐓𝐎 𝐑𝐈𝐔𝐒𝐂𝐈𝐓𝐎 🥷\n` +
      `Hai rubato ${rubato} € a @${mention.split("@")[0]}\n` +
      `═════ ೋೋ═════`;

    return conn.reply(m.chat, testo, prova, { mentions: [mention] });

  } else {
    const tassa = 40;
    ladro.money = Math.max(0, ladro.money - tassa);

    const testo = 
      `═════ ೋೋ═════\n` +
      `+ 𝐅𝐔𝐑𝐓𝐎 𝐅𝐀𝐋𝐋𝐈𝐓𝐎 ❌\n` +
      `Hai pagato una tassa di ${tassa} €!\n` +
      `═════ ೋೋ═════`;

    return conn.reply(m.chat, testo, prova);
  }
};

handler.command = /^furto$/i;

export default handler;