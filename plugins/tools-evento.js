import moment from 'moment-timezone';

const handler = async (m, { conn, text, args }) => {
  const input = text?.split('|').map(x => x.trim());
  if (!input || input.length < 3)
    return m.reply(`❌ Formato errato.\nUsa:\n.evento Titolo | HH:mm | YYYY-MM-DD`);

  const [titolo, orario, data] = input;

  // Unione data e ora
  const dateString = `${data} ${orario}`;
  const timezone = 'Europe/Rome';
  const start = moment.tz(dateString, 'YYYY-MM-DD HH:mm', timezone);

  if (!start.isValid()) return m.reply('❌ Data o orario non validi');

  const startTime = start.valueOf(); // in ms
  const endTime = start.clone().add(2, 'hours').valueOf(); // +2 ore

  await conn.sendMessage(
    m.chat,
    {
      event: {
        isCanceled: false,
        name: titolo,
        description: `Evento creato da @${m.sender.split('@')[0]}`,
        location: {
          degreesLatitude: 41.9028,
          degreesLongitude: 12.4964,
          name: 'Roma, Italia'
        },
        startTime,
        endTime,
        extraGuestsAllowed: true
      }
    },
    {
      quoted: m,
      mentions: [m.sender]
    }
  );
};

handler.command = ['evento'];
handler.tags = ['tools'];
handler.help = ['evento titolo | orario | data'];
export default handler;