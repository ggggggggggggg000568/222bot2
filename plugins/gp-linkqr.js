import QRCode from 'qrcode';

let handler = async (m, { conn }) => {
    try {
        let groupLink = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat);
        let qrCodeData = await QRCode.toDataURL(groupLink);
        let buffer = Buffer.from(qrCodeData.split(',')[1], 'base64');

        await conn.sendMessage(m.chat, { image: buffer, caption: `🔗 *Link del gruppo:* ${groupLink}` });
    } catch (e) {
        m.reply('❌ Errore nel generare il QR code! Assicurati di avere i permessi per generare il link.');
    }
};

handler.command = ['linkqr'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
