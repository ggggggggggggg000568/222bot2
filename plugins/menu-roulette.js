let handler = async (m, { conn, usedPrefix, command }) => {
    const text = `
═════ ೋೋ═════
🎰 MENU ROULETTE 🎰
═════ ೋೋ═════

📌 COMANDI:

1️⃣ LOBBY
  Usa: assicurati di creare una lobby con 
  nome e quota: 
  *.roulette lobby <nome> <quota>*
  💰 Quota massima: 10000€

2️⃣ JOIN
  Partecipa a una lobby esistente:
  *.roulette join <nome_lobby>*
  ⚠️ Partita non iniziata e non esistente.

3️⃣ START
  Avvia la partita entrati a minimo 2 giocatori:
  *.roulette start <nome_lobby>*
  🔒 Solo il creatore.

4️⃣ SHOT
  Sparare a un giocatore nella partita:
  *.roulette shot @utente*
  🎯 40% di probabilità di colpire.

5️⃣ VITE
  Visualizza le vite rimaste dei giocatori:
  *.roulette vite <nome_lobby>*

6️⃣ STOP
  Ferma e cancella la lobby:
  *.roulette stop <nome_lobby>*
  🔒 Solo il creatore.

═════ ೋೋ═════
💡 Usa i comandi con attenzione e buona fortuna!
═════ ೋೋ═════
`;

    const buttons = [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: 'MENU PRINCIPALE' }, type: 1 },
        { buttonId: `${usedPrefix}funzioni`, buttonText: { displayText: '⚙️ FUNZIONI' }, type: 1 },
        { buttonId: `${usedPrefix}menuadm`, buttonText: { displayText: '🛠️ ADMIN' }, type: 1 }
    ];

    const buttonMessage = {
        text: text,
        footer: 'Gioca responsabilmente!',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage);
};

handler.help = ["menuroulette"];
handler.tags = ['menu'];
handler.command = /^(menuroulette)$/i;

export default handler;