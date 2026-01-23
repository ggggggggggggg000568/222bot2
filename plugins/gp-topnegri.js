// Crediti: ONIX, di Riad
const handler = async (_0x17b471, { conn, command, participants }) => {
    // Ottieni tutti gli utenti eccetto il bot
    const participantsList = participants
        .filter((participant) => participant.id !== conn.user.jid) // Escludi il bot
        .map((participant) => ({ jid: participant.id })); // Ottieni solo gli ID degli utenti

    // Controlla se ci sono utenti sufficienti
    if (participantsList.length < 2) {
        return conn.sendMessage(_0x17b471.chat, { text: '🚫 Non ci sono abbastanza utenti per creare una classifica di coppie! 🚫' });
    }

    // Mescola casualmente la lista (Fisher-Yates Shuffle)
    for (let i = participantsList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participantsList[i], participantsList[j]] = [participantsList[j], participantsList[i]]; // Swap
    }

    // Crea le coppie
    const pairsList = [];
    for (let i = 0; i < participantsList.length; i += 2) {
        if (i + 1 < participantsList.length) {
            pairsList.push([participantsList[i], participantsList[i + 1]]);
        }
    }

    // Limita a 10 coppie
    const topPairsList = pairsList.slice(0, 10);

    // Descrizioni di Riad il fantasioso
    const descriptions = [
        "𝐍𝐞𝐠𝐫𝐢 𝐯𝐞𝐫𝐢🏆",
        "𝐂𝐚𝐩𝐢 𝐝𝐞𝐥 𝐛𝐚𝐫𝐜𝐨𝐧𝐞 ⛴️",
        "𝐍𝐞𝐠𝐫𝐢 𝐟𝐫𝐨𝐜𝐢💞",
        "𝐍𝐞𝐠𝐫𝐢 𝐝𝐨𝐰𝐧🤓",
        "𝐋𝐞 𝐧𝐞𝐠𝐫𝐞👩🏿‍🦱👩🏿‍🦱",
        "𝐍𝐞𝐠𝐫𝐢 𝐜𝐨𝐧 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐦𝐢𝐧𝐢🍆",
        "𝐃𝐮𝐞 𝐧𝐞𝐠𝐫𝐢 𝐝𝐨𝐰𝐧👨🏿👨🏿",
        "𝐓𝐫𝐨𝐢𝐞 𝐧𝐞𝐠𝐫𝐞💅",
        "𝐍𝐞𝐠𝐫𝐢 𝐬𝐜𝐡𝐢𝐚𝐯𝐢♿",
        "𝐍𝐞𝐠𝐫𝐢 𝐛𝐛𝐜🍆"
    ];

    // Crea il messaggio completo
    const topPairsMessage = `😵‍💫 *Top Negri* 😵‍💫\n\n${topPairsList
        .map((pair, index) => `➪ *${index + 1}. @${pair[0].jid.split('@')[0]} 𝐄 @${pair[1].jid.split('@')[0]}* - ${descriptions[index]}`)
        .join('\n')}`;

    const customMessage = "\n\nChe Negri😵";

    // Invia un unico messaggio con solo i tag necessari
    await conn.sendMessage(_0x17b471.chat, {
        text: topPairsMessage + customMessage,
        mentions: topPairsList.flat().map((user) => user.jid), // Tagga solo i 20 utenti della lista
    });
};

// Definisci il comando
handler.command = /^(topnegri)$/i; // Comando specifico
handler.group = true; // Solo nei gruppi

export default handler;