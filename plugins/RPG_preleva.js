let handler = async (m, { conn, command, text, args }) => {
  if (!text) throw '💬 *Inserisci l\'importo da prelevare dalla banca.*';

  let users = global.db.data.users;
  const who = m.sender;
  const prelievo = parseInt(text);

  if (isNaN(prelievo)) throw `❌ *"${text}" non è un numero valido.*`;
  if (prelievo <= 0) throw `⚠️ *Non puoi prelevare ${prelievo} €.*`;
  if (prelievo > users[who].bank) throw `🏦 *Non hai abbastanza soldi in banca.*`;

  // Aggiorna valori
  users[who].bank -= prelievo;
  users[who].money += prelievo;
  users[who].ultimoprelievo = prelievo;
  users[who].prelievi = (users[who].prelievi || 0) + prelievo;

  const bank = users[who].bank;
  const contanti = users[who].money;

  const testo = `
╔═━━━⬩【🏦】⬩━━━═╗
     💸 *PRELIEVO* 💸
╚═━━━⬩【🏦】⬩━━━═╝

💵 Hai prelevato: *${prelievo} €*

━━━━━━━━━━━━━━━━
💼 *Saldo Bancario:* ${bank} €
👛 *Contanti Ora:* ${contanti} €
📅 *Ultimo Prelievo:* ${prelievo} €
━━━━━━━━━━━━━━━━
`;

  conn.reply(m.chat, testo.trim(), m);
};

handler.command = /^preleva|withdraw$/i;
export default handler;