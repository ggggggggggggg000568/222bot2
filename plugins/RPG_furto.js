//Codice di RPG_ruba.js

let handler = async (m, { conn, partecipants, command, text, args, usedPrefix}) => {
  if (!text) throw `𝐀𝐠𝐠𝐢𝐮𝐧𝐠𝐢 𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐢 𝐭𝐞𝐥𝐞𝐟𝐨𝐧𝐨 𝐝𝐞𝐥𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐜𝐡𝐞 𝐯𝐮𝐨𝐢 𝐫𝐚𝐩𝐢𝐧𝐚𝐫𝐞\n𝐧𝐨𝐧 𝐥𝐚 𝐭𝐚𝐠𝐠𝐚𝐫𝐞 𝐨 𝐯𝐞𝐫𝐫𝐚𝐢 𝐬𝐜𝐨𝐩𝐞𝐫𝐭𝐨!\n𝐞𝐬. ${usedPrefix}𝐫𝐚𝐩𝐢𝐧𝐚 +𝟑𝟗 𝟑𝟓𝟏 𝟗𝟓𝟕 𝟏𝟑𝟔𝟐 | 𝟐𝟎%`;
  let testo2 = text.split('|');
  let testo = 'errore';
  let user = global.db.data.users;
  const who = formatWhatsAppNumber(testo2[0]);
  if (!user[who]) throw `𝐢𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐢𝐧𝐬𝐞𝐫𝐢𝐭𝐨 𝐧𝐨𝐧 è 𝐯𝐚𝐥𝐢𝐝𝐨\n𝐞𝐬. ${usedPrefix}𝐫𝐚𝐩𝐢𝐧𝐚 +𝟑𝟗 𝟑𝟓𝟏 𝟗𝟓𝟕 𝟏𝟑𝟔𝟐 | 𝟐𝟎%`;
  if (!testo2[1]) throw '𝐜𝐡𝐞 𝐩𝐞𝐫𝐜𝐞𝐧𝐭𝐮𝐚𝐥𝐞 𝐝𝐢 𝐝𝐞𝐧𝐚𝐫𝐨 𝐯𝐮𝐨𝐢 𝐫𝐮𝐛𝐚𝐫𝐞 𝐝𝐚𝐥 𝐬𝐮𝐨 𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨?\n\n𝐫𝐢𝐜𝐨𝐫𝐝𝐚: 𝟖𝟎% 𝐠𝐮𝐚𝐝𝐚𝐠𝐧𝐨 = 𝟐𝟎% 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨';
  const percentuale = testo2[1].replace(/[\s%]/g, '');
  if (isNaN(percentuale)) throw `𝐍𝐨𝐧 𝐡𝐚𝐢 𝐢𝐧𝐬𝐞𝐫𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐦𝐞𝐫𝐨\n𝐞𝐬. ${usedPrefix}𝐫𝐚𝐩𝐢𝐧𝐚 +𝟑𝟗 𝟑𝟓𝟏 𝟗𝟓𝟕 𝟏𝟑𝟔𝟐 | 𝟐𝟎%`;
  if (percentuale < 20) throw '𝐝𝐞𝐯𝐢 𝐭𝐞𝐧𝐭𝐚𝐫𝐞 𝐝𝐢 𝐫𝐮𝐛𝐚𝐫𝐞 𝐚𝐥𝐦𝐞𝐧𝐨 𝐢𝐥 𝟐𝟎% 𝐝𝐞𝐥 𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨';
  if (percentuale > 99) throw '𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐮𝐛𝐚𝐫𝐞 𝐩𝐢ù 𝐝𝐞𝐥 𝟗𝟗% 𝐝𝐞𝐥 𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨';
  if (m.sender == who) throw '𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐫𝐮𝐛𝐚𝐫𝐞 𝐭𝐞 𝐬𝐭𝐞𝐬𝐬𝐨!';
const dataAttuale = new Date();
  const formatoData = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatoOra = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const dataFormattata = dataAttuale.toLocaleDateString('it-IT', formatoData);
  const oraFormattata = dataAttuale.toLocaleTimeString('it-IT', formatoOra);
  const risultato = `${oraFormattata} - ${dataFormattata}`;

  switch (probabilita(percentuale)) {
    case true:
      testo = `𝐚𝐥 𝐥𝐚𝐝𝐫𝐨!\n\n𝐬𝐞𝐢 𝐬𝐭𝐚𝐭𝐨 𝐬𝐜𝐨𝐩𝐞𝐫𝐭𝐨,𝐩𝐚𝐠𝐚 𝐥𝐚 𝐦𝐮𝐥𝐭𝐚!\n-𝟑𝟎 €`;
      user[m.sender].bank -= 30;
      break;
    case false:
      user[who].money -= Math.round((user[who].money * percentuale) / 100);
      user[who].furti += 1;
      user[who].datafurto = risultato;
      user[who].rubati += Math.round((user[who].money * percentuale) / 100);
      user[m.sender].money += Math.round((user[who].money * percentuale) / 100);
      testo = `𝐛𝐞𝐥 𝐜𝐨𝐥𝐩𝐨! 𝐡𝐚𝐢 𝐟𝐨𝐭𝐭𝐮𝐭𝐨 ${Math.round((user[who].money * percentuale) / 100)} € 𝐚 @${who.split`@`[0]}`;
      break;
    default:
      throw 'errore';
  }
if (user[m.sender].warn >= 3) {
    conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
  }
conn.reply(m.chat, testo, null, { mentions: [who] });
};
handler.command = /^napoli|rapina$/i;
export default handler;
function formatWhatsAppNumber(phoneNumber) {
const cleanedNumber = phoneNumber.toString().replace(/\D/g, '');
const whatsappNumber = `${cleanedNumber}@s.whatsapp.net`;
return whatsappNumber;
}
function probabilita(percentuale) {
  const randomValue = Math.random() * 100;
  return randomValue < percentuale;
}