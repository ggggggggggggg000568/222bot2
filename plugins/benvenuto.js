import { WAMessageStubType } from '@realvare/based'

async function getUserName(conn, jid, pushNameFromStub = '') {
    const isValid = str => str && typeof str === 'string' && str.length > 1 && str.length < 26 && !/^\d+$/.test(str)
    
    if (isValid(pushNameFromStub)) return pushNameFromStub
    
    const contact = conn.contacts?.[jid]
    if (contact) {
        if (isValid(contact.notify)) return contact.notify
        if (isValid(contact.name)) return contact.name
        if (isValid(contact.pushName)) return contact.pushName
        if (isValid(contact.verifiedName)) return contact.verifiedName
    }
    
    try {
        const nameFromApi = await conn.getName(jid)
        if (isValid(nameFromApi)) return nameFromApi
    } catch {}
    
    const phoneNumber = jid.split('@')[0]
    return `𝑼𝒕𝒆𝒏𝒕𝒆 ${phoneNumber}`
}

function replacePlaceholders(message, who, username, groupName, memberCount, displayName) {
    return message
        .replace(/@user/g, `@${who.split('@')[0]}`)
        .replace(/\$gruppo/g, groupName)
        .replace(/\$nome/g, displayName)
        .replace(/\$membri/g, memberCount.toString())
        .replace(/\$numero/g, who.split('@')[0])
        .replace(/\$tag/g, `@${who.split('@')[0]}`)
}

export async function before(m, { conn, groupMetadata }) {
    if (!m.isGroup || !m.messageStubType) return true
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat || chat.welcome === false) return true
    const who = m.messageStubParameters?.[0]
    const pushNameFromStub = m.messageStubParameters?.[1]
    if (!who || typeof who !== 'string' || !who.includes('@')) return true
    
    try {
        const username = await getUserName(conn, who, pushNameFromStub)
        const groupName = groupMetadata?.subject || '𝑄𝒖𝑒𝓈𝓉𝑜 𝒢𝓇𝓊𝓅𝓅𝑜'
        const memberCount = groupMetadata?.participants?.length || 0
        
        let displayName = username
        if (username.startsWith('@') || username === '𝐍𝐮𝐨𝐯𝐨 𝐌𝐞𝐦𝐛𝐫𝐨') {
            displayName = `𝑼𝒕𝒆𝒏𝒕𝒆 ${who.split('@')[0]}`
        }
        
        const sendWelcomeMessage = async (isGoodbye = false) => {
            let message
            if (isGoodbye) {
                const defaultMsg = `╭─◆─◆──◆─◆─╮
           👋 𝑨𝑫𝑫𝑰𝑶 👋
 ╰─◆─◆──◆─◆─╯

👤 𝑼𝒕𝒆𝒏𝒕𝒆: @${who.split('@')[0]}
👥 𝑮𝒓𝒖𝒑𝒑𝒐: ${groupName}  
🔢 𝑴𝒆𝒎𝒃𝒓𝒊 𝒓𝒊𝒎𝒂𝒔𝒕𝒊: ${memberCount - 1}`
                
                message = chat.customGoodbye 
                    ? replacePlaceholders(chat.customGoodbye, who, username, groupName, memberCount, displayName)
                    : defaultMsg
            } else {
                const defaultMsg = `╭─◆─◆──◆─◆─╮
      🎊 𝑩𝑬𝑵𝑽𝑬𝑵𝑼𝑻𝑶 🎊
 ╰─◆─◆──◆─◆─╯

👤 𝑼𝒕𝒆𝒏𝒕𝒆: @${who.split('@')[0]}
👥 𝑮𝒓𝒖𝒑𝒑𝒐: ${groupName}
🔢 𝑴𝒆𝒎𝒃𝒓𝒊: ${memberCount}`
                
                message = chat.customWelcome 
                    ? replacePlaceholders(chat.customWelcome, who, username, groupName, memberCount, displayName)
                    : defaultMsg
            }
            
            await conn.sendMessage(m.chat, {
                text: message,
                mentions: [who]
            })
        }
        
        if (
            m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ||
            m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN ||
            m.messageStubType === 27
        ) {
            await sendWelcomeMessage(false)
        } 
        else if (
            m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
            m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
        ) {
            await sendWelcomeMessage(true)
        }
    } catch (error) {
        console.error('Errore nel plugin benvenuto:', error)
        
        const isGoodbye = [
            WAMessageStubType.GROUP_PARTICIPANT_REMOVE, 
            WAMessageStubType.GROUP_PARTICIPANT_LEAVE
        ].includes(m.messageStubType)
        
        const fallbackMsg = isGoodbye ? 
            `𝘼𝙧𝙧𝙞𝙫𝙚𝙙𝙚𝙧𝙘𝙞 @${who.split('@')[0]} 👋` : 
            `𝘽𝙚𝙣𝙫𝙚𝙣𝙪𝙩𝙤 @${who.split('@')[0]} 🎉`
        
        await conn.sendMessage(m.chat, {
            text: fallbackMsg,
            mentions: [who]
        })
    }
    
    return true
}