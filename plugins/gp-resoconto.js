import fs from 'fs'
import path from 'path'

const DATA_DIR = './data_rank'
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)

const getFilePath = (chatId) => path.join(DATA_DIR, `${chatId}.json`)

const loadData = (chatId) => {
  try {
    const filePath = getFilePath(chatId)
    if (!fs.existsSync(filePath)) return {
      enabled: false,
      users: {},
      excluded: [], // Lista utenti esclusi
      settings: { ignoreCommands: true }
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    // Backward compatibility
    if (!data.excluded) data.excluded = []
    return data
  } catch (e) {
    console.error('Errore caricamento dati:', e)
    return {
      enabled: false,
      users: {},
      excluded: [],
      settings: { ignoreCommands: true }
    }
  }
}

const saveData = (chatId, data) => {
  fs.writeFileSync(getFilePath(chatId), JSON.stringify(data, null, 2))
}

const getTodayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

const getWeekKey = () => {
  const d = new Date()
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

const getMonthKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()+1}`
}

const handler = async (m, { conn, command }) => {
  const chatId = m.chat
  const isGroup = chatId.endsWith('@g.us')

  if (!isGroup) return m.reply('⚠️ Questo comando funziona solo nei gruppi!')

  let data = loadData(chatId)

  // COMANDI BASE
  if (command === 'startranking') {
    if (data.enabled) return m.reply('⚠️ Il ranking è già attivo in questo gruppo!')
    data.enabled = true
    data.users = {}
    data.excluded = []
    saveData(chatId, data)
    return m.reply('✅ *Ranking attivato!* Ora conto i messaggi in questo gruppo!')
  }

  if (command === 'stopranking') {
    if (!data.enabled) return m.reply('⚠️ Il ranking non è attivo in questo gruppo!')
    data.enabled = false
    saveData(chatId, data)
    return m.reply('✅ *Ranking disattivato!* Non conterò più i messaggi qui.')
  }

  if (!data.enabled && ['rankoggi', 'ranksettimana', 'rankmese', 'ranktotale'].includes(command)) {
    return m.reply('ℹ Il ranking non è attivo in questo gruppo.\nUsa *!startranking* per attivarlo!')
  }

  // GENERAZIONE CLASSIFICA (ESCLUDENDO GLI UTENTI)
  const generateRanking = async (key, title) => {
    const ranking = []
    
    for (const userId in data.users) {
      // Escludi gli utenti nella lista excluded
      if (data.excluded.includes(userId)) continue
      
      const u = data.users[userId]
      const count = key === 'totale' ? (u.total || 0) : (u[key] || 0)
      if (count > 0) ranking.push({ userId, count })
    }

    if (ranking.length === 0) return m.reply('📭 Nessun messaggio registrato ancora!')

    ranking.sort((a, b) => b.count - a.count)

    let text = `🏆 *${title}* 🏆\n\n`
    const mentions = []

    for (let i = 0; i < Math.min(10, ranking.length); i++) {
      const { userId, count } = ranking[i]
      mentions.push(userId)
      text += `${i+1}. @${userId.split('@')[0]} - ${count} messaggi\n`
    }

    // PULSANTI DI NAVIGAZIONE
    const buttons = [
      { buttonId: '.rankoggi', buttonText: { displayText: '📅 Oggi' }, type: 1 },
      { buttonId: '.ranksettimana', buttonText: { displayText: '📆 Settimana' }, type: 1 },
      { buttonId: '.rankmese', buttonText: { displayText: '🗓️ Mese' }, type: 1 },
      { buttonId: '.ranktotale', buttonText: { displayText: '📊 Totale' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, { 
      text, 
      mentions,
      footer: 'Naviga tra le classifiche con i pulsanti',
      buttons,
      headerType: 1
    }, { quoted: m })
  }

  // GESTIONE COMANDI CLASSIFICA
  switch (command) {
    case 'rankoggi':
      return generateRanking(getTodayKey(), 'CLASSIFICA GIORNALIERA')
    case 'ranksettimana':
      return generateRanking(getWeekKey(), 'CLASSIFICA SETTIMANALE')
    case 'rankmese':
      return generateRanking(getMonthKey(), 'CLASSIFICA MENSILE')
    case 'ranktotale':
      return generateRanking('totale', 'CLASSIFICA TOTALE')
  }
}

// MIDDLEWARE PER CONTEGGIO MESSAGGI (CONTA ANCHE PER UTENTI ESCLUSI MA NON LI MOSTRA)
handler.before = async function(m, { conn }) {
  try {
    if (m.isBaileys || !m.chat.endsWith('@g.us')) return
    
    const chatId = m.chat
    const sender = m.sender
    const data = loadData(chatId)
    
    if (!data.enabled) return

    // IGNORA COMANDI SE IMPOSTATO
    if (data.settings.ignoreCommands && m.text && m.text.startsWith('!')) return

    if (!data.users) data.users = {}
    if (!data.users[sender]) data.users[sender] = { total: 0 }

    const userData = data.users[sender]
    const today = getTodayKey()
    const week = getWeekKey()
    const month = getMonthKey()

    // AGGIORNA TUTTI I CONTATORI (ANCHE PER UTENTI ESCLUSI)
    userData.total = (userData.total || 0) + 1
    userData[today] = (userData[today] || 0) + 1
    userData[week] = (userData[week] || 0) + 1
    userData[month] = (userData[month] || 0) + 1

    saveData(chatId, data)
  } catch (e) {
    console.error('Errore nel conteggio messaggi:', e)
  }
}

handler.command = /^(startranking|stopranking|rankoggi|ranksettimana|rankmese|ranktotale)$/i
handler.tags = ['group']
handler.help = [
  '!startranking - Attiva il conteggio messaggi',
  '!stopranking - Disattiva il conteggio',
  '!rankoggi - Mostra la classifica di oggi (con menzioni)',
  '!ranksettimana - Mostra la classifica settimanale',
  '!rankmese - Mostra la classifica mensile',
  '!ranktotale - Mostra la classifica totale'
]

export default handler