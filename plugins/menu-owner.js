let handler = async (m, { conn, usedPrefix }) => {
    const botName = global.db.data.nomedelbot || " ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ ";

    const menuText = `
╭───〔 ⚡ *PANNELLO OWNER* ⚡ 〕───╮

📌 *Comandi disponibili:*
  ✦ .impostanome
  ✦ .resettanome
  ✦ .setgruppi
  ✦ .aggiungigruppi @
  ✦ .resetgruppi @
  ✦ .setpp (immagine)
  ✦ .gestisci @
  ✦ .banuser @
  ✦ .unbanuser @
  ✦ .blockuser @
  ✦ .unblockuser @
  ✦ .out
  ✦ .prefisso
  ✦ .resetprefisso
  ✦ .godmode
  ✦ .azzera
  ✦ .addowner @
  ✦ .delowner @
  ✦ .downall
  ✦ .upall
  ✦ .blocklist
  ✦ .banlist
  ✦ .banghost
  ✦ .lock
  ✦ .safe
  ✦ .getplugin
  ✦ .getfile
  ✦ .saveplugin
  ✦ .deleteplugin
  ✦ .bigtat
╰───〔 ⚡ ${botName} ⚡ 〕───╯
`.trim();

    // 🔥 PULSANTI FUNZIONALI
    const buttons = [
        {
            buttonId: `${usedPrefix}menu`,
            buttonText: { displayText: "🔙 MENU PRINCIPALE" },
            type: 1,
        },
        {
            buttonId: `${usedPrefix}ping`,
            buttonText: { displayText: "PING BOT 🚀" },
            type: 1,
        }
    ];

    const message = {
        text: menuText,
        footer: 'Comandi esclusivi per owner',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, message);
};

handler.help = ["owner", "menuowner", "pannello"];
handler.tags = ['menu'];
handler.command = /^(owner|menuowner|pannello)$/i;

export default handler;
