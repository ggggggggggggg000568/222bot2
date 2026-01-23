let handler = async (m, { conn, command, text, args }) => {
  if (!text) throw '💬 *Inserisci l\'importo da depositare in banca.*';

  let users = global.db.data.users;
  const who = m.sender;
  const deposito = parseInt(text);

  if (isNaN(deposito)) throw `❌ *"${text}" non è un numero valido.*`;
  if (deposito <= 0) throw `⚠️ *Non puoi depositare ${deposito} €.*`;
  if (deposito > users[who].money) throw `💸 *Non hai abbastanza contanti nel portafoglio.*`;

  // Aggiorna valori
  users[who].bank += deposito;
  users[who].money -= deposito;
  users[who].ultimodeposito = deposito;
  users[who].depositi = (users[who].depositi || 0) + deposito;

  const bank = users[who].bank;
  const contanti = users[who].money;

  const testo = `
╔═━━━⬩【🏦】⬩━━━═╗
     💰 *DEPOSITO* 💰
╚═━━━⬩【🏦】⬩━━━═╝

🪙 Hai depositato: *${deposito} €*

━━━━━━━━━━━━━━━
💼 *Saldo Bancario:* ${bank} €
👛 *Contanti Rimasti:* ${contanti} €
📅 *Ultimo Deposito:* ${deposito} €
━━━━━━━━━━━━━━━
`;

  conn.reply(m.chat, testo.trim(), m);
};

handler.command = /^deposita|deposito$/i;
export default handler;