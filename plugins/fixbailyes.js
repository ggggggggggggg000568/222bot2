import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

let handler = async (m) => {
  const pluginsDir = './plugins';
  
  function replaceInFile(filePath) {
    try {
      let content = readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // CORREZIONE: baileys non bailyes
      content = content.replace(/@whiskeysockets\/baileys/g, '@realvare/based');
      
      if (content !== originalContent) {
        writeFileSync(filePath, content, 'utf8');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  function scanDirectory(dir) {
    let modifiedCount = 0;
    
    try {
      const files = readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = join(dir, file.name);
        
        if (file.isDirectory()) {
          modifiedCount += scanDirectory(fullPath);
        } else if (file.isFile() && extname(file.name) === '.js') {
          if (replaceInFile(fullPath)) {
            modifiedCount++;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    
    return modifiedCount;
  }

  m.reply('🔄 Sostituzione @realvare/based con @realvare/based in corso...');
  
  const totalModified = scanDirectory(pluginsDir);
  
  m.reply(`🎉 Sostituzione completata! File modificati: ${totalModified}`);
};

handler.command = /^(replacebaileys|fixbaileys)$/i;
handler.owner = true;
handler.rowner = true;

export default handler;