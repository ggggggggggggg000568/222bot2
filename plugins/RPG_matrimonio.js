// Plugin matrimonio con bottoni stile amicizia — by filo222
const proposals = {}

let handler = async (m, { conn, participants, command, text, args, usedPrefix }) => {
    let users = global.db.data.users
    let user = users[m.sender]

    switch (command) {
        case 'sposa':
            await handleSposa(m, user, users, text, usedPrefix, conn)
            break
        case 'divorzia':
            handleDivorzia(m, user, users, conn)
            break
    }
}

const handleSposa = async (m, user, users, text, usedPrefix, conn) => {
    let mention = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
    if (!mention) throw `💍 𝐓𝐚𝐠𝐠𝐚 𝐥𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚 𝐝𝐚 𝐬𝐩𝐨𝐬𝐚𝐫𝐞!\n𝐄𝐬𝐞𝐦𝐩𝐢𝐨: ${usedPrefix}sposa @utente`
    if (mention === m.sender) throw '❌ 𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐬𝐩𝐨𝐬𝐚𝐫𝐭𝐢 𝐝𝐚 𝐬𝐨𝐥𝐚/𝐨!'

    let destinatario = users[mention]
    if (!destinatario) throw '❌ 𝐔𝐭𝐞𝐧𝐭𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.'

    if (user.sposato) {
        return m.reply(`💔 𝐒𝐞𝐢 𝐠𝐢à 𝐬𝐩𝐨𝐬𝐚𝐭𝐨/𝐚 𝐜𝐨𝐧 @${user.coniuge.split('@')[0]}!`, null, {
            mentions: [user.coniuge]
        })
    }

    if (destinatario.sposato)
        return m.reply(`💔 @${mention.split('@')[0]} è 𝐠𝐢à 𝐬𝐩𝐨𝐬𝐚𝐭𝐨/𝐚!`, null, {
            mentions: [mention]
        })

    if (proposals[m.sender] || proposals[mention])
        throw `⏳ 𝐔𝐧𝐚 𝐩𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐞̀ 𝐠𝐢𝐚̀ 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨. 𝐀𝐭𝐭𝐞𝐧𝐝𝐢 𝐥𝐚 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐚.`

    proposals[mention] = { from: m.sender, timeout: null }
    proposals[m.sender] = { to: mention, timeout: null }

    let testo = `💍 𝐏𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨...\n\n@${mention.split('@')[0]}, 𝐯𝐮𝐨𝐢 𝐬𝐩𝐨𝐬𝐚𝐫𝐞 @${m.sender.split('@')[0]}?\n\n⏳ 𝐇𝐚𝐢 60 𝐬𝐞𝐜𝐨𝐧𝐝𝐢 𝐩𝐞𝐫 𝐬𝐜𝐞𝐠𝐥𝐢𝐞𝐫𝐞.`

    let buttons = [
        { buttonId: 'accettasposa', buttonText: { displayText: '✅ 𝐒𝐢' }, type: 1 },
        { buttonId: 'rifiutasposa', buttonText: { displayText: '❌ 𝐍𝐨' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        text: testo,
        buttons,
        mentions: [mention, m.sender],
        headerType: 1
    }, { quoted: m })

    let timeoutCallback = () => {
        if (proposals[mention]) {
            conn.sendMessage(m.chat, {
                text: `⏳ 𝐏𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐝𝐢 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐚!\n@${m.sender.split('@')[0]} e @${mention.split('@')[0]} 𝐧𝐨𝐧 𝐡𝐚𝐧𝐧𝐨 𝐫𝐢𝐬𝐩𝐨𝐬𝐭𝐨.`,
                mentions: [m.sender, mention]
            })
            delete proposals[mention]
            delete proposals[m.sender]
        }
    }

    proposals[mention].timeout = setTimeout(timeoutCallback, 60000)
    proposals[m.sender].timeout = proposals[mention].timeout
}

handler.before = async (m, { conn }) => {
    if (!m.message || !m.message.buttonsResponseMessage) return

    let response = m.message.buttonsResponseMessage.selectedButtonId
    let sender = m.sender

    if (!proposals[sender]) return

    let fromUser = proposals[sender].from || sender
    let toUser = sender

    clearTimeout(proposals[sender].timeout)

    let mittente = global.db.data.users[fromUser]
    let ricevente = global.db.data.users[toUser]

    if (response === 'rifiutasposa') {
        delete proposals[fromUser]
        delete proposals[toUser]
        return m.reply(`❌ 𝐏𝐫𝐨𝐩𝐨𝐬𝐭𝐚 𝐫𝐢𝐟𝐢𝐮𝐭𝐚𝐭𝐚.`, null, {
            mentions: [fromUser]
        })
    }

    if (response === 'accettasposa') {
        mittente.sposato = true
        mittente.coniuge = toUser
        ricevente.sposato = true
        ricevente.coniuge = fromUser

        delete proposals[fromUser]
        delete proposals[toUser]

        return m.reply(`💘 𝐃𝐢𝐜𝐡𝐢𝐚𝐫𝐨 𝐮𝐟𝐟𝐢𝐜𝐢𝐚𝐥𝐦𝐞𝐧𝐭𝐞 𝐬𝐩𝐨𝐬𝐚𝐭𝐢 @${fromUser.split('@')[0]} 𝐞 @${toUser.split('@')[0]}!\n𝐅𝐢𝐧𝐜𝐡𝐞́ 𝐦𝐨𝐫𝐭𝐞 𝐧𝐨𝐧 𝐯𝐢 𝐬𝐞𝐩𝐚𝐫𝐢 💍`, null, {
            mentions: [fromUser, toUser]
        })
    }
}

const handleDivorzia = (m, user, users, conn) => {
    if (!user.sposato) throw '💔 𝐍𝐨𝐧 𝐬𝐞𝐢 𝐬𝐩𝐨𝐬𝐚𝐭𝐨/𝐚!'

    let exId = user.coniuge
    let ex = users[exId]

    if (!ex) throw '❌ 𝐂𝐨𝐧𝐢𝐮𝐠𝐞 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨.'

    if (!Array.isArray(user.ex)) user.ex = []
    if (!user.ex.includes(exId)) user.ex.push(exId)

    if (!Array.isArray(ex.ex)) ex.ex = []
    if (!ex.ex.includes(m.sender)) ex.ex.push(m.sender)

    user.sposato = false
    user.coniuge = ''
    ex.sposato = false
    ex.coniuge = ''

    conn.sendMessage(m.chat, {
        text: `💔 𝐃𝐢𝐯𝐨𝐫𝐳𝐢𝐨 𝐜𝐨𝐧𝐟𝐞𝐫𝐦𝐚𝐭𝐨!\n@${m.sender.split('@')[0]} e @${exId.split('@')[0]} 𝐧𝐨𝐧 𝐬𝐨𝐧𝐨 𝐩𝐢𝐮̀ 𝐬𝐩𝐨𝐬𝐢.\n\n🙄 𝐓𝐚𝐧𝐭𝐨 𝐞𝐫𝐚𝐯𝐚𝐭𝐞 𝐮𝐧𝐚 𝐜𝐨𝐩𝐩𝐢𝐚 𝐨𝐫𝐫𝐢𝐛𝐢𝐥𝐞...`,
        mentions: [m.sender, exId]
    })
}

handler.command = ['sposa', 'divorzia']
handler.group = true

export default handler