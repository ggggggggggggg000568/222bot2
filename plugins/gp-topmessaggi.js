import fetch from "node-fetch"

let handler = async (m, { conn, args, participants }) => {

    // Prepara lista utenti del gruppo
    let lista = participants
        .filter(p => p.id !== conn.user.jid)
        .map(p => {
            let user = global.db.data.users[p.id] || {}
            return {
                jid: p.id,
                messaggi: Number(user.messaggi || 0)
            }
        })

    // Ordina dal maggiore al minore
    lista.sort((a, b) => b.messaggi - a.messaggi)

    // Numero richiesto (default 10)
    let n = args[0] ? Math.min(100, Math.max(1, parseInt(args[0]))) : 10

    if (n > 100) {
        return conn.reply(
            m.chat,
            "⚠️ La classifica può mostrare massimo i primi 100 utenti.",
            m
        )
    }

    // Prendi i top N
    let top = lista.slice(0, n)

    // Trova posizione del mittente
    let pos = lista.findIndex(u => u.jid === m.sender)
    let posizione = pos >= 0 ? pos + 1 : "N/A"

    // Testo classifica identico all’originale
    let txt = `𝐓𝐨𝐩 *${n}* 𝐮𝐭𝐞𝐧𝐭𝐢 𝐜𝐨𝐧 𝐩𝐢𝐮̀ 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢\n\n`
    txt += top
        .map((u, i) => `${getMedaglia(i + 1)} « *${u.messaggi}* » @${u.jid.split('@')[0]}`)
        .join("\n")
    txt += `\n\n𝐋𝐚 𝐭𝐮𝐚 𝐩𝐨𝐬𝐢𝐳𝐢𝐨𝐧𝐞: *${posizione}°*`

    // Scarico thumbnail come nell’originale
    let url = "https://telegra.ph/file/b311b1ffefcc34f681e36.png"
    let resp = await fetch(url)
    let array = await resp.arrayBuffer()
    let thumb = Buffer.from(array)

    // Messaggio fake location identico
    let fakeLoc = {
        key: {
            participants: "0@s.whatsapp.net",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: "𝐂𝐥𝐚𝐬𝐬𝐢𝐟𝐢𝐜𝐚 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢",
                jpegThumbnail: thumb,
                vcard: `BEGIN:VCARD
VERSION:3.0
N:;Unlimited;;;
FN:Unlimited
ORG:Unlimited
TITLE:
item1.TEL;waid=19709001746:+1 (970) 900-1746
item1.X-ABLabel:Unlimited
X-WA-BIZ-DESCRIPTION:ofc
X-WA-BIZ-NAME:Unlimited
END:VCARD`
            }
        },
        participant: "0@s.whatsapp.net"
    }

    // Invia classifica
    conn.reply(m.chat, txt.trim(), fakeLoc, {
        mentions: top.map(u => u.jid)
    })
}

handler.command = /^(top)$/i
handler.group = true

export default handler

function getMedaglia(n) {
    if (n === 1) return "🥇"
    if (n === 2) return "🥈"
    if (n === 3) return "🥉"
    return "🏅"
}
