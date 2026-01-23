import fs from 'fs';
import path from 'path';
import syntaxError from 'syntax-error';

const _fs = fs.promises;

// Funzione per cercare file simili
function findSimilarFiles(searchTerm, baseDir = process.cwd(), maxResults = 5) {
    const results = [];
    
    function searchRecursive(dir) {
        try {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const fullPath = path.join(dir, file);
                
                try {
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        // Escludi node_modules e altre cartelle pesanti
                        if (!file.includes('node_modules') && !file.includes('.git')) {
                            searchRecursive(fullPath);
                        }
                    } else {
                        // Calcola similarità
                        const fileName = path.basename(file, path.extname(file));
                        const similarity = calculateSimilarity(searchTerm.toLowerCase(), fileName.toLowerCase());
                        
                        if (similarity > 0.3) { // Soglia di similarità
                            results.push({
                                path: fullPath,
                                name: file,
                                baseName: fileName,
                                similarity: similarity,
                                relativePath: path.relative(baseDir, fullPath)
                            });
                        }
                    }
                } catch (err) {
                    // Ignora errori di permesso
                    continue;
                }
            }
        } catch (err) {
            // Ignora errori di lettura directory
        }
    }
    
    searchRecursive(baseDir);
    
    // Ordina per similarità (decrescente) e prendi i primi risultati
    return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults);
}

// Algoritmo di similarità (Dice Coefficient)
function calculateSimilarity(a, b) {
    const bigramsA = getBigrams(a);
    const bigramsB = getBigrams(b);
    
    const intersection = bigramsA.filter(bigram => bigramsB.includes(bigram));
    
    return (2 * intersection.length) / (bigramsA.length + bigramsB.length);
}

function getBigrams(str) {
    const bigrams = [];
    for (let i = 0; i < str.length - 1; i++) {
        bigrams.push(str.substring(i, i + 2));
    }
    return bigrams;
}

const handler = async (m, { conn, text, usedPrefix, command, __dirname }) => {
  try {
    // ========== COMANDO GETPLUGIN/GETFILE (RICERCA CON SUGGERIMENTI) ==========
    if (command === 'getplugin' || command === 'getfile' || command === 'gp' || command === 'gf') {
      if (!text?.trim()) {
        return conn.sendMessage(m.chat, {
          text: `🔍 *RICERCA AVANZATA FILE*\n\n❓ Inserisci il nome o parte del nome del file\n📝 *Esempio:*\n${usedPrefix}gp owner\n${usedPrefix}gp menu\n${usedPrefix}gp database`
        }, { quoted: m });
      }

      // Cerca file simili
      const similarFiles = findSimilarFiles(text, process.cwd(), 5);
      
      if (similarFiles.length === 0) {
        return conn.sendMessage(m.chat, {
          text: `❌ *NESSUN FILE TROVATO*\n\nImpossibile trovare file simili a: "${text}"\n\n🔎 *Suggerimenti:*\n• Controlla il spelling\n• Usa parole più generiche\n• Verifica che il file esista`
        }, { quoted: m });
      }

      // Se c'è solo un risultato, vai direttamente alla selezione
      if (similarFiles.length === 1) {
        const file = similarFiles[0];
        const messaggio = `🎯 *FILE TROVATO*\n\n🗂️ *Nome:* ${file.name}\n📂 *Percorso:* ${file.relativePath}\n⭐ *Corrispondenza:* ${(file.similarity * 100).toFixed(1)}%\n📊 *Dimensione:* ${(fs.statSync(file.path).size / 1024).toFixed(2)} KB\n\n⚡ *Scegli un'azione:*`;

        return await conn.sendMessage(m.chat, {
          text: messaggio,
          footer: '222 Bot File Manager',
          buttons: [
            { buttonId: `${usedPrefix}fileplugin ${file.path}`, buttonText: { displayText: '📜 Vedi Codice' }, type: 1 },
            { buttonId: `${usedPrefix}ottienifile ${file.path}`, buttonText: { displayText: '📥 Scarica File' }, type: 1 }
          ],
          viewOnce: true,
          headerType: 1
        }, { quoted: m });
      }

      // Mostra lista di file simili
      let listaFile = `🔍 *RICERCA: "${text}"*\n\n📋 *File trovati (${similarFiles.length}):*\n\n`;
      
      similarFiles.forEach((file, index) => {
        const percentuale = (file.similarity * 100).toFixed(1);
        listaFile += `${index + 1}️⃣ *${file.name}*\n   📁 ${file.relativePath}\n   ⭐ ${percentuale}% corrispondenza\n\n`;
      });

      listaFile += `⚡ *Seleziona un file:*`;

      // Crea bottoni per ogni file trovato
      const buttons = similarFiles.map((file, index) => ({
        buttonId: `${usedPrefix}selectfile ${file.path}`,
        buttonText: { displayText: `${index + 1}️⃣ ${file.name}` },
        type: 1
      }));

      await conn.sendMessage(m.chat, {
        text: listaFile,
        footer: 'Seleziona un file ꪶ͢𝟐𝟐𝟐ꫂ',
        buttons: buttons,
        headerType: 1
      }, { quoted: m });

    // ========== COMANDO SELECTFILE (SELEZIONE FILE) ==========
    } else if (command === 'selectfile') {
      if (!text) return m.reply('❌ Specifica il percorso del file');

      const filePath = text.trim();
      
      if (!fs.existsSync(filePath)) {
        return m.reply(`❌ File non trovato: ${filePath}`);
      }

      if (fs.statSync(filePath).isDirectory()) {
        return m.reply('❌ Non puoi selezionare una cartella');
      }

      const fileName = path.basename(filePath);
      const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
      const relativePath = path.relative(process.cwd(), filePath);

      const messaggio = `🎯 *FILE SELEZIONATO*\n\n🗂️ *Nome:* ${fileName}\n📂 *Percorso:* ${relativePath}\n📊 *Dimensione:* ${fileSize} KB\n\n⚡ *Scegli un'azione:*`;

      await conn.sendMessage(m.chat, {
        text: messaggio,
        footer: '222 Bot File Manager',
        buttons: [
          { buttonId: `${usedPrefix}fileplugin ${filePath}`, buttonText: { displayText: '📜 Vedi Codice' }, type: 1 },
          { buttonId: `${usedPrefix}ottienifile ${filePath}`, buttonText: { displayText: '📥 Scarica File' }, type: 1 },
          { buttonId: `${usedPrefix}gp ${path.basename(filePath, path.extname(filePath))}`, buttonText: { displayText: '🔍 Nuova Ricerca' }, type: 1 }
        ],
        viewOnce: true,
        headerType: 1
      }, { quoted: m });

    // ========== COMANDO OTTIENIFILE (DOWNLOAD) ==========
    } else if (command === 'ottienifile') {
      if (!text) return m.reply('❌ Specifica il percorso del file da scaricare');

      let filePath = text.trim();
      
      if (!fs.existsSync(filePath)) 
        return m.reply(`❌ File non trovato: ${filePath}`);

      if (fs.statSync(filePath).isDirectory()) 
        return m.reply('❌ Non puoi scaricare una cartella');

      const buffer = await _fs.readFile(filePath);
      const fileName = path.basename(filePath);
      const fileSize = (buffer.length / 1024 / 1024).toFixed(2);

      await conn.sendMessage(m.chat, {
        text: `📥 *DOWNLOAD COMPLETATO*\n\n🗂️ *File:* ${fileName}\n📊 *Dimensione:* ${fileSize} MB\n✅ File inviato con successo!`
      }, { quoted: m });

      return await conn.sendMessage(m.chat, {
        document: buffer,
        fileName: fileName,
        mimetype: 'application/octet-stream'
      }, { quoted: m });

    // ========== COMANDO FILEPLUGIN (VISUALIZZA CODICE) ==========
    } else if (command === 'fileplugin') {
      if (!text) {
        return m.reply(`📜 *VISUALIZZATORE CODICE*\n\nUtilizzo: ${usedPrefix}fileplugin <percorso>\n\nEsempi:\n${usedPrefix}fileplugin handler.js\n${usedPrefix}fileplugin plugins/owner/menu.js`);
      }

      let pathFile = text.trim();
      
      if (!fs.existsSync(pathFile)) 
        return m.reply(`❌ File non trovato: ${pathFile}`);

      if (fs.statSync(pathFile).isDirectory()) 
        return m.reply('❌ Non puoi visualizzare una cartella');

      const fileExt = path.extname(pathFile).toLowerCase();
      const fileName = path.basename(pathFile);
      const relativePath = path.relative(process.cwd(), pathFile);
      
      // Leggi il file
      if (['.js', '.json', '.txt', '.md', '.ts', '.html', '.css', '.xml'].includes(fileExt)) {
        const fileContent = await _fs.readFile(pathFile, 'utf8');
        const fileSize = fileContent.length;
        
        if (fileSize > 50000) { // 50KB limit per visualizzazione
          await conn.sendMessage(m.chat, {
            text: `📜 *FILE TROPPO GRANDE*\n\nIl file ${fileName} è troppo grande (${(fileSize/1024).toFixed(2)}KB)\n📥 Usa il download per visualizzarlo completamente`,
            buttons: [
              { buttonId: `${usedPrefix}ottienifile ${pathFile}`, buttonText: { displayText: '📥 Scarica File' }, type: 1 }
            ]
          }, { quoted: m });
          return;
        }

        // Header del messaggio
        await m.reply(`📜 *CODICE SORGENTE*\n\n🗂️ *File:* ${fileName}\n📂 *Percorso:* ${relativePath}\n📊 *Dimensioni:* ${fileSize} caratteri`);

        // Invia il codice
        await m.reply(`\`\`\`${fileExt.substring(1)}\n${fileContent}\n\`\`\``);

        // Controllo sintassi per JavaScript/TypeScript
        if (fileExt === '.js' || fileExt === '.ts') {
          const error = syntaxError(fileContent, fileName, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
          });
          
          if (error) {
            await m.reply(`⚠️ *ERRORI DI SINTASSI*\n\n\`\`\`${error}\`\`\``);
          } else {
            await m.reply('✅ *Sintassi verificata: Nessun errore*');
          }
        }
      } else {
        // Per file binari, invia come file
        const fileBuffer = await _fs.readFile(pathFile);
        await m.reply(`📁 *FILE BINARIO*\n\nImpossibile visualizzare il contenuto di ${fileName}\n📥 Invio come file...`);
        await m.reply(fileBuffer);
      }
    }

  } catch (err) {
    console.error('Errore File Manager:', err);
    await conn.sendMessage(m.chat, {
      text: `❌ *ERRORE*\n\n${err.message}`
    }, { quoted: m });
  }
};

// Help e comandi
handler.help = [
  'gp <nome> - Cerca file con suggerimenti',
  'ottienifile <percorso> - Scarica file',
  'fileplugin <percorso> - Visualizza codice'
];

handler.tags = ['owner'];
handler.command = /^(getplugin|getfile|gp|gf|ottienifile|fileplugin|selectfile)$/i;
handler.owner = true;

export default handler;