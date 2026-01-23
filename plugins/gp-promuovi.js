import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const whitelistPath = join(__dirname, 'group_whitelists.json')
let whitelists = {}

try {
  whitelists = JSON.parse(readFileSync(whitelistPath, 'utf8'))
} catch {
  writeFileSync(whitelistPath, '{}')
  whitelists = {}
}

// ───────────────────────────────────────────
// 🔧 numero / @ / jid
// ───────────────────────────────────────────
function toJid(input) {
  if (!input) return null
  input = input.toString().trim().toLowerCase()

  if (input.endsWith('@s.whatsapp.net')) return input
  if (input.endsWith('@lid')) return input
  if (input.startsWith('@')) input = input.slice(1)

  const num = input.replace(/\D/g, '')
  if (num.length >= 8) return num + '@s.whatsapp.net'
  return null
}

// ───────────────────────────────────────────
// 🔥 risolve LID → jid reale
// ───────────────────────────────────────────
function resolveLid(jid, participants) {
  if (!jid || !jid.endsWith('@lid')) return jid

  const base = jid.split('@')[0]
  const found = participants.find(p =>
    p.lid === jid ||
    p.id === jid ||
    p.id.includes(base)
  )

  return found ? found.id : null
}

// ───────────────────────────────────────────
// 🔧 prende target
// ───────────────────────────────────────────
function extractTargets(m, mentionedJid, args) {
  let out = []

  if (mentionedJid && mentionedJid.length) out.push(...mentionedJid)
  if (m.quoted?.sender) out.push(m.quoted.sender)

  const ext = m.message?.extendedTextMessage?.contextInfo?.mentionedJid
  if (ext?.length) out.push(...ext)

  if (args?.[0] && !args[0].startsWith('@')) {
    const jid = toJid(args[0])
    if (jid) out.push(jid)
  }

  return [...new Set(out.map(toJid).filter(Boolean))]
}

function saveWhitelists() {
  writeFileSync(whitelistPath, JSON.stringify(whitelists, null, 2))
}

async function getGroupWhitelist(conn, groupId) {
  const meta = await conn.groupMetadata(groupId)
  const founder = meta.owner

  const globalOwners = Array.isArray(global.owner)
    ? global.owner.map(o => o[0] + '@s.whatsapp.net')
    : []

  const groupWhitelist = whitelists[groupId] || []
  return [...new Set([...groupWhitelist, ...globalOwners, founder])]
}

async function canUsePromoteDemote(conn, groupId, sender) {
  const meta = await conn.groupMetadata(groupId)
  const founder = meta.owner

  const globalOwners = Array.isArray(global.owner)
    ? global.owner.map(o => o[0] + '@s.whatsapp.net')
    : []

  const groupWhitelist = whitelists[groupId] || []

  return (
    sender === founder ||
    globalOwners.includes(sender) ||
    groupWhitelist.includes(sender)
  )
}

// ───────────────────────────────────────────
// 🔥 HANDLER
// ───────────────────────────────────────────
let handler = async (m, { conn, mentionedJid, args, command }) => {
  if (!m.isGroup) return

  const sender = m.sender.replace('@c.us', '@s.whatsapp.net')
  const groupId = m.chat

  const meta = await conn.groupMetadata(groupId)
  const participants = meta.participants
  const members = participants.map(p => p.id)

  // ───────────── PROMUOVI (.p)
  if (command === 'p') {
    if (!(await canUsePromoteDemote(conn, groupId, sender))) return

    const raw = extractTargets(m, mentionedJid, args)
    if (!raw.length) return m.reply('❌ Nessun utente riconosciuto.')

    const targets = raw
      .map(j => resolveLid(j, participants))
      .filter(j => j && members.includes(j))

    if (!targets.length) {
      return m.reply('❌ L\'utente che hai taggato/non hai taggato non esiste nel gruppo.')
    }

    for (const user of targets) {
      await conn.groupParticipantsUpdate(groupId, [user], 'promote', { silent: true })

      const promoterTag = sender.split('@')[0]
      const targetTag = user.split('@')[0]

      const msg =
`     ┌────────────┐
  👑  𝓝𝓤𝓞𝓥𝓐 𝓟𝓡𝓞𝓜𝓞𝓩𝓘𝓞𝓝𝓔 
         └────────────┘

🙋‍♂️ *Utente promosso:* @${targetTag}
🧑‍⚖️ *Azione fatta da:* @${promoterTag}
📌 *Gruppo:* ${meta.subject}

🆙 L’utente ora possiede i privilegi da amministratore.`

      await conn.sendMessage(groupId, {
        text: msg,
        mentions: [sender, user]
      })
    }
  }

  // ───────────── DECLASSA (.r)
  if (command === 'r') {
    if (!(await canUsePromoteDemote(conn, groupId, sender))) return

    const raw = extractTargets(m, mentionedJid, args)
    const whitelist = await getGroupWhitelist(conn, groupId)

    const targets = raw
      .map(j => resolveLid(j, participants))
      .filter(j => j && members.includes(j))

    for (const user of targets) {
      if (whitelist.includes(user)) continue

      await conn.groupParticipantsUpdate(groupId, [user], 'demote')

      const promoterTag = sender.split('@')[0]
      const targetTag = user.split('@')[0]

      const msg =
`    ┌────────────┐
   ⚠️ 𝓓𝓔𝓒𝓛𝓐𝓢𝓢𝓐𝓜𝓔𝓝𝓣𝓞 
        └────────────┘

🙍‍♂️ *Utente declassato:* @${targetTag}
🧑‍⚖️ *Azione fatta da:* @${promoterTag}
📌 *Gruppo:* ${meta.subject}

🔻 L’utente ha perso i privilegi da amministratore.`

      await conn.sendMessage(groupId, {
        text: msg,
        mentions: [sender, user]
      })
    }
  }

  // ───────────── WHITELIST (.wp)
  if (command === 'wp') {
    const sub = args[0]?.toLowerCase()
    const jid = toJid(args[1])
    if (!sub) return

    if (sub === 'list') {
      const list = (whitelists[groupId] || [])
        .map(u => `▸ @${u.split('@')[0]}`)
        .join('\n') || 'Vuota'

      return m.reply(`📋 Whitelist per questo gruppo:\n${list}`, null, {
        mentions: whitelists[groupId] || []
      })
    }

    if (sub === 'add' && jid) {
      if (!whitelists[groupId]) whitelists[groupId] = []
      if (!whitelists[groupId].includes(jid)) {
        whitelists[groupId].push(jid)
        saveWhitelists()
      }

      return m.reply(`✅ @${jid.split('@')[0]} aggiunto alla whitelist!`, null, {
        mentions: [jid]
      })
    }

    if (sub === 'remove' && jid) {
      whitelists[groupId] = (whitelists[groupId] || []).filter(u => u !== jid)
      saveWhitelists()

      return m.reply(`🗑️ @${jid.split('@')[0]} rimosso dalla whitelist!`, null, {
        mentions: [jid]
      })
    }

    if (sub === 'reset') {
      whitelists[groupId] = []
      saveWhitelists()
      return m.reply('♻️ Whitelist resettata per questo gruppo!')
    }
  }
}

handler.command = /^(p|r|wp)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
