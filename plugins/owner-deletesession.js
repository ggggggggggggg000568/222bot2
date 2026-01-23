import { existsSync, promises as fs } from 'fs';
import path from 'path';

const handler = async (message, { conn }) => {
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(message.chat, {
      text: "*🚨 Usa questo comando direttamente dal numero del bot.*"
    }, { quoted: message });
  }

  const sessionFolder = "./222Session/";

  if (!existsSync(sessionFolder)) {
    return conn.sendMessage(message.chat, {
      text: "*❌ La cartella delle sessioni è vuota o non esiste.*"
    }, { quoted: message });
  }

  try {
    const sessionFiles = await fs.readdir(sessionFolder);
    const filesToDelete = sessionFiles.filter(f => f !== "creds.json");

    if (filesToDelete.length === 0) {
      return conn.sendMessage(message.chat, {
        text: "❗ Le sessioni sono già vuote ‼️"
      }, { quoted: message });
    }

    await Promise.all(
      filesToDelete.map(file => fs.unlink(path.join(sessionFolder, file)))
    );

    await conn.sendMessage(message.chat, {
      text: `🔥 Eliminati ${filesToDelete.length} file di sessione!`
    }, { quoted: message });

  } catch (error) {
    console.error('⚠️ Errore:', error);
    return conn.sendMessage(message.chat, {
      text: "❌ Errore durante l'eliminazione!"
    }, { quoted: message });
  }

  // Messaggio finale semplice, senza location
  await conn.sendMessage(message.chat, {
    text: "💌 Ora puoi leggere i messaggi del bot 🚀"
  }, { quoted: message });
};

handler.help = ['del_reg_in_session_owner'];
handler.tags = ["owner"];
handler.command = /^(deletession|dsowner|clearallsession)$/i;
handler.owner = true;

export default handler;