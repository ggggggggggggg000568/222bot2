import { downloadContentFromMessage } from '@realvare/based';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    if (!m.quoted) throw '𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨¹';

    let quotedMessage = m.quoted.message || m.quoted;
    let viewOnce = quotedMessage.viewOnceMessageV2 || quotedMessage.viewOnceMessage;

    if (!viewOnce || !viewOnce.message) {
        console.log('Messaggio ricevuto:', quotedMessage);
        throw '𝐍𝐨𝐧 𝐦𝐢 𝐬𝐞𝐦𝐛𝐫𝐚 𝐮𝐧𝐚 𝐟𝐨𝐭𝐨¹';
    }

    let mediaMsg = viewOnce.message;
    let type = Object.keys(mediaMsg).find(t => t.endsWith('Message'));

    if (!type || !/imageMessage|videoMessage/.test(type)) {
        console.log('Tipo di messaggio non riconosciuto:', type);
        throw '𝐍𝐨𝐧 è un file supportato.';
    }

    try {
        let mediaStream = await downloadContentFromMessage(mediaMsg[type], type === 'imageMessage' ? 'image' : 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of mediaStream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let extension = type === 'videoMessage' ? '.mp4' : '.jpg';
        let fileName = `temp_${Date.now()}${extension}`;
        let filePath = path.join('./temp', fileName);

        // Assicurati che la cartella ./temp esista
        if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

        // Salva il file
        fs.writeFileSync(filePath, buffer);

        // Invia nella chat
        let caption = mediaMsg[type].caption || '';
        await conn.sendFile(m.chat, filePath, fileName, caption, m);

        // Elimina il file dopo l'invio
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error('Errore nel download o invio:', err);
        throw 'Errore nel recupero o invio del file.';
    }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['mostra'];

export default handler;