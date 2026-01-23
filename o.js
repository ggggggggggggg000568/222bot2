import path from 'path';
import fs from 'fs';

const handler = async (m, { args }) => {
  const pluginName = args[0];

  if (!pluginName) {
    return m.reply('❌ Specifica il nome del plugin da controllare, es: *.controllapl livello.js*');
  }

  const filePath = path.resolve('./plugins', pluginName);

  if (!fs.existsSync(filePath)) {
    return m.reply(`❌ Plugin *${pluginName}* non trovato nella cartella /plugins`);
  }

  try {
    const fileUrl = pathToFileURL(filePath).href;

    // forza reload del modulo cancellando cache dinamica (solo per sviluppo)
    const module = await import(`${fileUrl}?update=${Date.now()}`);

    if (!module.default && typeof module.handler !== 'function') {
      return m.reply(`⚠️ Plugin *${pluginName}* non esporta correttamente un handler.`);
    }

    m.reply(`✅ Plugin *${pluginName}* caricato correttamente.\nNessun errore trovato.`);
  } catch (err) {
    m.reply(`❌ Errore nel plugin *${pluginName}*:\n\n\`\`\`\n${err.stack}\n\`\`\``);
  }
};

import { pathToFileURL } from 'url';

handler.command = /^controllapl$/i;
handler.rowner = true;
export default handler;


