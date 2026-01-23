import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (m, { conn, usedPrefix }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {
      text:
        "┏━━━〔 🚨 𝐀𝐕𝐕𝐈𝐒𝐎 🚨 〕━━━┓\n\n" +
        "✦ Usa questo comando\n" +
        "✦ Direttamente dal numero del bot\n\n" +
        "┗━━━━━━━━━━━━━━━━━┛"
    }, { quoted: m });
  }

  try {
    const sessionFolder = "./222Session/";

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(m.chat, {
        text:
          "┏━━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑𝐄 ❌ 〕━━━┓\n\n" +
          "✦ La cartella delle sessioni\n" +
          "✦ È vuota o non esiste\n\n" +
          "┗━━━━━━━━━━━━━━━━━━━━━━┛"
      }, { quoted: m });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deletedCount = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deletedCount++;
      }
    }

    const resultText =
      deletedCount === 0
        ? "┏━━━〔 ⚠️ 𝐀𝐕𝐕𝐈𝐒𝐎 ⚠️ 〕━━━┓\n\n" +
          "✦ Nessun file di sessione trovato\n" +
          "✦ Riprova più tardi!\n\n" +
          "┗━━━━━━━━━━━━━━━━┛"
        : "┏━━━〔 ✅ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐎 ✅ 〕━━━┓\n\n" +
  `✦ Eliminati ${deletedCount} file di sessione\n` +
   "✦ GRAZIE PER AVERMI SVUOTATO!\n\n" +"┗━━━━━━━━━━━━━━━━━━┛";

    await conn.sendMessage(m.chat, { text: resultText }, { quoted: m });
  } catch (error) {
    await conn.sendMessage(m.chat, {
      text:
        "┏━━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑𝐄 ❌ 〕━━━┓\n\n" +
        "✦ Si è verificato un errore durante\n" +
        "✦ L'eliminazione delle sessioni!\n\n" +
        "┗━━━━━━━━━━┛"
    }, { quoted: m });
  }
};

handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds)$/i;


export default handler;