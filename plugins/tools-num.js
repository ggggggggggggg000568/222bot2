let handler = async (m, { conn }) => {
    let targetNumber = m.sender; // Default: proprio numero
    
    // Prima controlla le menzioni
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        targetNumber = m.mentionedJid[0];
    }
    
    // Poi controlla le risposte (ha priorità più alta)
    if (m.quoted) {
        targetNumber = m.quoted.sender;
    }
    
    // Estrae solo i numeri (rimuove @ e altri caratteri non numerici)
    let cleanNumber = targetNumber.replace(/@/g, '').replace(/\D/g, '');
    
    // Formatta il numero con il +
    const formattedNumber = '+' + cleanNumber;
    
    m.reply(`📱 ${formattedNumber}`);
};

handler.command = /^(num|numero)$/i;
export default handler;