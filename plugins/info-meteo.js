import axios from 'axios';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const city = args.join(' ');
  if (!city) return m.reply(`❌ Specifica una città\nEsempio: *${usedPrefix}meteo roma*`);

  try {
    const apiKey = '2d61a72574c11c4f36173b627f8cb177'; // Sostituisci con la tua API key
    const loadingMsg = await m.reply(`⏳ Sto analizzando il meteo per *${city}*...`);

    // Ottieni dati meteo attuali e previsioni
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`)
    ]);

    const currentData = currentRes.data;
    const forecastData = forecastRes.data;

    // Traduci condizioni meteo
    const weatherConditions = {
      'Clear': '☀️ Soleggiato',
      'Clouds': '☁️ Nuvoloso',
      'Rain': '🌧️ Pioggia',
      'Thunderstorm': '⛈️ Temporale',
      'Snow': '❄️ Neve',
      'Mist': '🌫️ Foschia',
      'Drizzle': '🌦️ Pioggerella'
    };

    // Processa i dati per i giorni successivi
    const processDailyData = (list) => {
      const daily = {};
      list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('it-IT', { weekday: 'long', month: 'long', day: 'numeric' });
        if (!daily[date]) {
          daily[date] = {
            temps: [],
            conditions: [],
            details: []
          };
        }
        daily[date].temps.push(item.main.temp);
        daily[date].conditions.push(item.weather[0].main);
        daily[date].details.push({
          time: new Date(item.dt * 1000).toLocaleTimeString('it-IT', {hour: '2-digit'}),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          humidity: item.main.humidity,
          wind: (item.wind.speed * 3.6).toFixed(1)
        });
      });
      return Object.entries(daily).map(([date, data]) => ({
        date,
        maxTemp: Math.round(Math.max(...data.temps)),
        minTemp: Math.round(Math.min(...data.temps)),
        condition: data.conditions.sort((a,b) => 
          data.conditions.filter(v => v === a).length - data.conditions.filter(v => v === b).length
        ).pop(),
        details: data.details
      }));
    };

    const dailyForecasts = processDailyData(forecastData.list);

    // Crea i messaggi per ogni vista
    const createCurrentView = () => `
╭───────────────╮
  🌤️ METEO ATTUALE - ${currentData.name.toUpperCase()}
╰───────────────╯

📅 ${new Date().toLocaleDateString('it-IT')}
⏰ ${new Date().toLocaleTimeString('it-IT', {hour: '2-digit', minute:'2-digit'})}

🌡️ Temperatura: *${Math.round(currentData.main.temp)}°C*
💡 Percepita: *${Math.round(currentData.main.feels_like)}°C*
⬆️ Massima: *${Math.round(currentData.main.temp_max)}°C*
⬇️ Minima: *${Math.round(currentData.main.temp_min)}°C*
💧 Umidità: ${currentData.main.humidity}%
🌬️ Vento: ${(currentData.wind.speed * 3.6).toFixed(1)} km/h
${weatherConditions[currentData.weather[0].main] || currentData.weather[0].main}

╭───────────────╮
  🔍 PREVISIONI PROSSIME ORE
╰───────────────╯
${dailyForecasts[0].details.slice(0, 4).map(d => 
  `▸ ${d.time}: ${d.temp}°C ${weatherConditions[d.condition] || d.condition}`).join('\n')}
`.trim();

    const createTomorrowView = () => {
      const tomorrow = dailyForecasts[1];
      return `
╭──────────────────╮
  🌅 METEO DOMANI - ${currentData.name.toUpperCase()}
  📅 ${tomorrow.date}
╰──────────────────╯

🌡️ Temperatura: 
  ⬆️ Massima: *${tomorrow.maxTemp}°C*
  ⬇️ Minima: *${tomorrow.minTemp}°C*
${weatherConditions[tomorrow.condition] || tomorrow.condition}

╭──────────────────╮
  🕒 PREVISIONI ORARIE
╰──────────────────╯
${tomorrow.details.slice(0, 6).map(d => 
  `▸ ${d.time}: ${d.temp}°C ${weatherConditions[d.condition] || d.condition}
   💧 ${d.humidity}% 🌬️ ${d.wind} km/h`).join('\n')}
`.trim();
    };

    const create3DayView = () => `
╭──────────────────╮
  📅 METEO 3 GIORNI - ${currentData.name.toUpperCase()}
╰──────────────────╯

${dailyForecasts.slice(1, 4).map(day => `
📅 ${day.date.split(',')[0]}
${weatherConditions[day.condition] || day.condition}
⬆️ Max: *${day.maxTemp}°C*  ⬇️ Min: *${day.minTemp}°C*
`).join('\n')}
`.trim();

    const createWeekView = () => `
╭──────────────────╮
  🗓️ METEO SETTIMANA - ${currentData.name.toUpperCase()}
╰──────────────────╯

${dailyForecasts.slice(0, 7).map(day => `
📅 ${day.date.split(',')[0]}
${weatherConditions[day.condition] || day.condition}
⬆️ *${day.maxTemp}°C*  ⬇️ *${day.minTemp}°C*
`).join('\n')}
`.trim();

    // Determina quale vista mostrare
    let message = '';
    if (command === 'meteo') message = createCurrentView();
    if (command === 'meteod') message = createTomorrowView();
    if (command === 'meteo3d') message = create3DayView();
    if (command === 'meteow') message = createWeekView();

    // Pulsanti interattivi
    const buttons = [
      { buttonId: `${usedPrefix}meteo ${city}`, buttonText: { displayText: '🌤️ Oggi' }, type: 1 },
      { buttonId: `${usedPrefix}meteod ${city}`, buttonText: { displayText: '🌅 Domani' }, type: 1 },
      { buttonId: `${usedPrefix}meteo3d ${city}`, buttonText: { displayText: '📅 3 Giorni' }, type: 1 },
      { buttonId: `${usedPrefix}meteow ${city}`, buttonText: { displayText: '🗓️ Settimana' }, type: 1 }
    ];

    await conn.sendMessage(m.chat, {
      text: message,
      footer: 'ℹ️ Dati forniti da OpenWeatherMap',
      buttons: command === 'meteod' ? [] : buttons, // Rimuovi pulsanti se già nella vista domani
      headerType: 1
    }, { quoted: m });

    await conn.sendMessage(m.chat, { delete: loadingMsg.key });

  } catch (e) {
    console.error(e);
    m.reply(e.response?.status === 404 
      ? '📍 Città non trovata. Controlla il nome e riprova' 
      : '⚠ Errore di connessione. Riprova più tardi');
  }
};

handler.help = [
  ['meteo <città>', 'Meteo attuale'],
  ['meteod <città>', 'Previsioni domani'],
  ['meteo3d <città>', 'Previsioni 3 giorni'],
  ['meteow <città>', 'Previsioni settimana']
];
handler.tags = ['utility'];
handler.command = /^(meteo|meteod|meteo3d|meteow)$/i;
export default handler;