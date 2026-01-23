import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const handler = async (m, { conn }) => {
    try {
        await m.reply('🔄 Sto creando il backup del bot...\n📦 Escludendo node_modules...');

        const botDir = process.cwd();
        const backupName = `backup_bot_${Date.now()}.zip`;
        const backupPath = path.join(botDir, 'tmp', backupName); // CORRETTO: backupName invece di backupPath

        // Crea cartella tmp se non esiste
        const tmpDir = path.join(botDir, 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Crea lo stream di output
        const output = fs.createWriteStream(backupPath);
        const archive = archiver.create('zip', {
            zlib: { level: 6 }
        });

        return new Promise((resolve, reject) => {
            archive.on('error', (err) => {
                console.error('Errore archivio:', err);
                reject(err);
            });
            
            output.on('close', async () => {
                try {
                    const stats = fs.statSync(backupPath);
                    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                    
                    if (stats.size === 0) {
                        fs.unlinkSync(backupPath);
                        await m.reply('❌ Errore: Il backup è vuoto');
                        return resolve();
                    }

                    await m.reply(`✅ Backup completato!\n📁 Dimensione: ${fileSizeMB} MB\n📤 Invio in corso...`);

                    // Invia il file ZIP
                    await conn.sendMessage(
                        m.chat,
                        {
                            document: fs.readFileSync(backupPath),
                            fileName: backupName,
                            mimetype: 'application/zip',
                            caption: `📦 BACKUP BOT (Senza node_modules)\n🗂️ Data: ${new Date().toLocaleString()}\n💾 Dimensione: ${fileSizeMB} MB\n\n✅ Contiene solo file essenziali`
                        },
                        { quoted: m }
                    );

                    // Elimina il file temporaneo
                    fs.unlinkSync(backupPath);
                    resolve();

                } catch (error) {
                    console.error('Errore invio file:', error);
                    await m.reply('❌ Errore nell\'invio del backup');
                    reject(error);
                }
            });

            archive.pipe(output);

            // Lista delle cartelle da escludere
            const excludeDirs = [
                'node_modules',
                '.git',
                'tmp',
                'cache',
                'session',
                'baileys_store',
                'logs',
                '.vscode',
                '.github'
            ];

            // Funzione ricorsiva per aggiungere file ESCLUDENDO node_modules
            function addDirectory(dirPath, archivePath = '') {
                try {
                    const items = fs.readdirSync(dirPath);
                    
                    for (const item of items) {
                        // Salta le cartelle nella lista excludeDirs
                        if (excludeDirs.includes(item)) {
                            console.log(`⏭️ Saltata cartella: ${item}`);
                            continue;
                        }

                        const fullPath = path.join(dirPath, item);
                        const relativePath = path.join(archivePath, item);
                        
                        try {
                            const stat = fs.statSync(fullPath);
                            
                            if (stat.isDirectory()) {
                                // Aggiungi la cartella (se non è in excludeDirs)
                                archive.append(null, { name: relativePath + '/' });
                                addDirectory(fullPath, relativePath);
                            } else {
                                // Aggiungi tutti i file (tranne quelli esclusi)
                                archive.file(fullPath, { name: relativePath });
                            }
                        } catch (err) {
                            console.log(`⚠️ Errore file ${fullPath}:`, err.message);
                        }
                    }
                } catch (error) {
                    console.error(`❌ Errore cartella ${dirPath}:`, error);
                }
            }

            // Inizia l'archiviazione
            addDirectory(botDir);

            // Aggiungi informazioni sul sistema
            const systemInfo = {
                timestamp: new Date().toISOString(),
                nodeVersion: process.version,
                platform: process.platform,
                botDirectory: botDir,
                excluded: excludeDirs
            };

            archive.append(JSON.stringify(systemInfo, null, 2), { name: 'backup_info.json' });

            // Finalizza l'archivio
            archive.finalize();

        }).catch(async (error) => {
            console.error('Errore creazione backup:', error);
            await m.reply('❌ Errore nella creazione del backup: ' + error.message);
        });

    } catch (error) {
        console.error('Errore handler:', error);
        await m.reply('❌ Errore nel comando di backup: ' + error.message);
    }
};

handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^(backup|backuplight|downloadbot)$/i;
handler.rowner = true;

export default handler;