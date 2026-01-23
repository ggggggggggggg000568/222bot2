let adoptions = global.adoptions || (global.adoptions = {})
let proposals = global.proposals || (global.proposals = {})

function trovaRichiestaCoinvolto(dati, sender) {
    for (let [k, v] of Object.entries(dati)) {
        if (v.from === sender || v.to === sender) return { chiave: k, valore: v }
    }
    return null
}

let handler = async (m, { conn, usedPrefix, command }) => {
    const tipoCmd = command.toLowerCase()

    // Comandi diretti
    if (tipoCmd === 'annullaadozione' || tipoCmd === 'annullasposa') {
        let tipo = tipoCmd === 'annullaadozione' ? 'adozione' : 'matrimonio'
        let dati = tipo === 'adozione' ? adoptions : proposals
        let r = trovaRichiestaCoinvolto(dati, m.sender)

        if (!r) return m.reply(`❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐧𝐞𝐬𝐬𝐮𝐧𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 ${tipo} 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨.`)

        let { chiave, valore } = r
        clearTimeout(valore.timeout)

        delete dati[valore.from]
        delete dati[valore.to]

        return await conn.sendMessage(m.chat, {
            text: `⚠️ 𝐋𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 ${tipo} è stata annullata da @${m.sender.split('@')[0]}.`,
            mentions: [valore.from, valore.to]
        })
    }

    // .annulla principale
    const haAdozione = trovaRichiestaCoinvolto(adoptions, m.sender)
    const haMatrimonio = trovaRichiestaCoinvolto(proposals, m.sender)

    if (!haAdozione && !haMatrimonio)
        return m.reply('❌ 𝐍𝐨𝐧 𝐡𝐚𝐢 𝐧𝐞𝐬𝐬𝐮𝐧𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐢 𝐚𝐝𝐨𝐳𝐢𝐨𝐧𝐞 𝐨 𝐦𝐚𝐭𝐫𝐢𝐦𝐨𝐧𝐢𝐨 𝐢𝐧 𝐜𝐨𝐫𝐬𝐨.')

    const buttons = []

    if (haAdozione)
        buttons.push({ buttonId: `${usedPrefix}annullaadozione`, buttonText: { displayText: '👶 Annulla Adozione' }, type: 1 })

    if (haMatrimonio)
        buttons.push({ buttonId: `${usedPrefix}annullasposa`, buttonText: { displayText: '💍 Annulla Matrimonio' }, type: 1 })

    await conn.sendMessage(m.chat, {
        text: '⚠️ 𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐥𝐚 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚 𝐝𝐚 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐫𝐞:',
        buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = ['annulla', 'annullaadozione', 'annullasposa']
handler.group = true

export default handler