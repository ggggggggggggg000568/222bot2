import { getDevice } from '@realvare/based'
import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'

const handler = async (m, { conn, usedPrefix, command }) => {
  const mention = m.mentionedJid?.[0] || (m.quoted?.sender || m.quoted) || m.sender
  const who = mention
  const user = global.db.data.users[who] || {}

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = {
      money: 0,
      warn: 0,
      warnlink: 0,
      muto: false,
      banned: false,
      messaggi: 0,
      blasphemy: 0,
      command: 0,
      age: 0,
      genere: null,
      vittorieSlot: 0,
      categoria: null,
      nomeinsta: null,
      name: null
    }
  }

  const gradi = [
    { min: 0, max: 999, nome: "Principiante I", emoji: "👶" },
    { min: 1000, max: 2499, nome: "Principiante II", emoji: "🧒" },
    { min: 2500, max: 3999, nome: "Principiante III", emoji: "👦" },
    { min: 4000, max: 6999, nome: "Novizio I", emoji: "🧑" },
    { min: 7000, max: 9999, nome: "Novizio II", emoji: "👨" },
    { min: 10000, max: 14999, nome: "Novizio III", emoji: "👨‍💼" },
    { min: 15000, max: 19999, nome: "Intermedio I", emoji: "🦸" },
    { min: 20000, max: 24999, nome: "Intermedio II", emoji: "🦸‍♂️" },
    { min: 25000, max: 29999, nome: "Intermedio III", emoji: "🦸‍♀️" },
    { min: 30000, max: 34999, nome: "Avanzato I", emoji: "🧙" },
    { min: 35000, max: 39999, nome: "Avanzato II", emoji: "🧙‍♂️" },
    { min: 40000, max: 44999, nome: "Avanzato III", emoji: "🧙‍♀️" },
    { min: 45000, max: 49999, nome: "Esperto I", emoji: "🧛" },
    { min: 50000, max: 54999, nome: "Esperto II", emoji: "🧛‍♂️" },
    { min: 55000, max: 59999, nome: "Esperto III", emoji: "🧛‍♀️" },
    { min: 60000, max: 64999, nome: "Maestro I", emoji: "🧝" },
    { min: 65000, max: 69999, nome: "Maestro II", emoji: "🧝‍♂️" },
    { min: 70000, max: 74999, nome: "Maestro III", emoji: "🧝‍♀️" },
    { min: 75000, max: 79999, nome: "Leggendario I", emoji: "🧞" },
    { min: 80000, max: 84999, nome: "Leggendario II", emoji: "🧞‍♂️" },
    { min: 85000, max: 89999, nome: "Leggendario III", emoji: "🧞‍♀️" },
    { min: 90000, max: Infinity, nome: "Eclipsiano Supremo", emoji: "💫🔥" }
  ]

  const msgCount = user.messaggi || 0
  const grado = gradi.find(g => msgCount >= g.min && msgCount <= g.max) || gradi[0]
  const next = gradi.find(g => g.min > grado.min)
  const percent = next ? Math.round(((msgCount - grado.min) / (next.min - grado.min)) * 100) : 100
  const progressBar = next
    ? '█'.repeat(percent / 10) + '▒'.repeat(10 - (percent / 10))
    : '█'.repeat(10)

  let gender = user.genere || 'Non specificato'
  gender = gender === 'maschio' ? '🚹 𝗠𝗮𝘀𝗰𝗵𝗶𝗼' : gender === 'femmina' ? '🚺 𝗙𝗲𝗺𝗺𝗶𝗻𝗮' : '⚧️ 𝗔𝗹𝘁𝗿𝗼'

  const dispositivo = await getDevice(m.key.id)
  const groups = Object.values(await conn.groupFetchAllParticipating())
  const gruppiAdmin = groups
    .filter(g => g.participants.some(p => p.id === who && p.admin))
    .map(g => g.subject)

  let pic
  try {
    pic = await conn.profilePictureUrl(who, 'image')
  } catch (e) {
    pic = 'https://telegra.ph/file/560f1667a55ecf09650cd.png'
  }

  conn.sendMessage(m.chat, {
    text:
`╭━━━「 𝙿𝚁𝙾𝙵𝙸𝙻𝙾 」━━━◆
┃ 👤 𝗨𝘁𝗲𝗻𝘁𝗲: ${user.name || 'Sconosciuto'}
┃ 🎖 𝗟𝗶𝘃𝗲𝗹𝗹𝗼: ${grado.nome} ${grado.emoji}
┃ 💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗴𝗶: ${msgCount}
┃ 📱 𝗗𝗶𝘀𝗽𝗼𝘀𝗶𝘁𝗶𝘃𝗼: ${dispositivo}
┃ 🚻 𝗚𝗲𝗻𝗲𝗿𝗲: ${gender}
┃ 🎂 𝗘𝘁𝗮̀: ${user.age || '–'}
╰━━━━━━━━━━━━━◆

╭━━━「 𝗦𝗧𝗔𝗧𝗨𝗦 」━━━◆
┃ ⚠️ 𝗪𝗮𝗿𝗻: ${user.warn || 0}/3
${user.warnlink ? `┃ 🔗 𝗪𝗮𝗿𝗻 𝗟𝗶𝗻𝗸: ${user.warnlink}/3\n` : ''}${user.blasphemy ? `┃ 🤬 𝗕𝗲𝘀𝘁𝗲𝗺𝗺𝗶𝗲: ${user.blasphemy}\n` : ''}${user.muto ? `┃ 🔇 𝗠𝘂𝘁𝗼: Sì\n` : ''}${user.banned ? `┃ 🚫 𝗕𝗹𝗼𝗰𝗰𝗼 𝗖𝗼𝗺𝗮𝗻𝗱𝗶: Sì\n` : ''}╰━━━━━━━━━━━◆

╭━━━「 𝗔𝗧𝗧𝗜𝗩𝗜𝗧𝗔̀ 」━━━◆
┃ 🛠 𝗖𝗼𝗺𝗮𝗻𝗱𝗶: ${user.command || 0}
┃ 🎰 𝗦𝗹𝗼𝘁 𝗩𝗶𝘁𝘁𝗼𝗿𝗶𝗲: ${user.vittorieSlot || 0}
┃ 🗃 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗮: ${user.categoria || '–'}
╰━━━━━━━━━━━━━━◆

╭━━━「 𝗦𝗢𝗖𝗜𝗔𝗟 」━━━◆
┃ 📸 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: ${user.nomeinsta ? `instagram.com/${user.nomeinsta}` : 'Non impostato'}
╰━━━━━━━━━━━━━━◆`,
    contextInfo: {
      mentionedJid: [who],
      externalAdReply: {
        title: `${user.name || 'Utente'} | ${gender}`,
        body: user.nomeinsta ? '' : `${usedPrefix}setig + nome_ig per impostare Instagram`,
        sourceUrl: `https://wa.me/${who.split('@')[0]}`,
        thumbnail: await (await fetch(pic)).buffer()
      }
    }
  }, { quoted: null })
}

handler.command = /^(bal|msg|attivit[àa]|profilo|info)$/i
export default handler