import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Necessario per ottenere il percorso assoluto

// Ottieni __dirname in ambiente ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn }) => {
    try {
        // Percorso assoluto della cartella 'plugins'
        let pluginsPath = path.join(__dirname, '../plugins');
        
        // Controlla se la cartella esiste
        if (!fs.existsSync(pluginsPath)) {
            return await conn.sendMessage(m.chat, { text: '❌ *La cartella plugins non esiste!*' }, { quoted: m });
        }

        // Legge il contenuto della cartella
        let files = fs.readdirSync(pluginsPath);
        
        // Filtra solo i file .js
        let jsFiles = files.filter(file => file.endsWith('.js'));
        
        // Crea il messaggio con la lista dei file
        let listMessage = jsFiles.length > 0 
            ? `🗂️ *Lista dei  plugins:*\n\n${jsFiles.map(f => `- ${f}`).join('\n')}`
            : '❌ *Nessun file .js trovato nella cartella plugins!*';
        
        // Invia il messaggio
        await conn.sendMessage(m.chat, { text: listMessage }, { quoted: m });
    } catch (error) {
        // Gestisce eventuali errori
        await conn.sendMessage(m.chat, { text: `❌ *Errore durante la lettura dei file:* ${error.message}` }, { quoted: m });
    }
};

handler.command = /^(listapl)$/i; // Comando per ottenere la lista
handler.group = false; // Funziona anche nei messaggi privati
handler.admin = false; // Non richiede permessi di amministratore

export default handler;
