// ===============================================
//  🔥 222 BOT — IP LOGGER ULTRA REALISTICO
//  Nessun database — Nessun undefined
//  Completamente generato in modo credibile
// ===============================================

const CITTA = [
    { comune: "Roma", provincia: "RM", regione: "Lazio", cap: "001xx" },
    { comune: "Milano", provincia: "MI", regione: "Lombardia", cap: "201xx" },
    { comune: "Torino", provincia: "TO", regione: "Piemonte", cap: "101xx" },
    { comune: "Napoli", provincia: "NA", regione: "Campania", cap: "801xx" },
    { comune: "Bologna", provincia: "BO", regione: "Emilia-Romagna", cap: "401xx" },
    { comune: "Genova", provincia: "GE", regione: "Liguria", cap: "161xx" },
    { comune: "Firenze", provincia: "FI", regione: "Toscana", cap: "501xx" },
    { comune: "Bari", provincia: "BA", regione: "Puglia", cap: "701xx" },
    { comune: "Venezia", provincia: "VE", regione: "Veneto", cap: "301xx" },
    { comune: "Palermo", provincia: "PA", regione: "Sicilia", cap: "901xx" }
]

const STRADE = [
    "Via Garibaldi", "Via Roma", "Via Dante", "Corso Italia",
    "Via Manzoni", "Via Verdi", "Via Leopardi", "Via Milano",
    "Viale Trento", "Viale Venezia", "Via Torino"
]

const ISP = [
    "TIM S.p.A.", "Vodafone Italia", "WindTre S.p.A.",
    "Iliad", "Fastweb", "Tiscali Italia", "PosteMobile"
]

const DEVICES = [
    "iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra",
    "Xiaomi 14 Pro", "iPhone 14", "OnePlus 12",
    "Galaxy A55", "Redmi Note 13"
]

// Generatore numeri civico
const civico = () => Math.floor(Math.random() * 200 + 1)

// Generatore IPv4
function ipv4() {
    return `79.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
}

// Generatore IPv6 realistico
function ipv6() {
    return `2a00:${Math.floor(Math.random()*9999)}:${Math.floor(Math.random()*9999)}::${Math.floor(Math.random()*9999)}`
}

// ===============================
//   HANDLER
// ===============================
let handler = async (m, { conn }) => {

    if (!m.mentionedJid?.length)
        return m.reply("📌 *Tagga un utente:*\n.ip @utente")

    const target = m.mentionedJid[0]
    const numero = target.split("@")[0]

    const luogo = CITTA[Math.floor(Math.random() * CITTA.length)]
    const via = STRADE[Math.floor(Math.random() * STRADE.length)]
    const isp = ISP[Math.floor(Math.random() * ISP.length)]
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)]

    const lat = (41 + Math.random()*4).toFixed(6)
    const lon = (12 + Math.random()*4).toFixed(6)

    const msg = `
┌─────────────────────────────┐
   🛰 *REPORT IP — 222 SECURITY*
└─────────────────────────────┘

👤 *Utente analizzato:* @${numero}

📍 *Localizzazione stimata*
• Comune: *${luogo.comune}*
• Provincia: *${luogo.provincia}*
• Regione: *${luogo.regione}*
• CAP: *${luogo.cap.replace("xx", Math.floor(Math.random()*89+10))}*
• Nazione: *Italia 🇮🇹*

🏠 *Indirizzo stimato*
• Via: *${via}, ${civico()}*
• Comune: *${luogo.comune}*
• CAP: *${luogo.cap.replace("xx", Math.floor(Math.random()*89+10))}*

🌐 *Informazioni rete*
• IPv4: *${ipv4()}*
• IPv6: *${ipv6()}*
• ISP: *${isp}*
• Connessione: *4G/5G LTE*
• Ping stimato: *${Math.floor(Math.random()*40+5)} ms*

📡 *Coordinate approssimative*
• Latitudine: *${lat}*
• Longitudine: *${lon}*

📱 *Dispositivo*
• Modello: *${device}*
• OS: *Android / iOS (rilevamento parziale)*

⚠️ *Rischio sicurezza*
• Valutazione: *Basso*
• Analisi: *Nessuna attività sospetta rilevata*

🕓 *Timestamp*
• ${new Date().toLocaleString("it-IT")}

─────────────────────────────
卍 卍 卍 卍 卍 卍 卍 卍 卍 卍 卍
─────────────────────────────
`

    await m.reply("📡 *IP inviato in privato con successo.*")
    await conn.sendMessage(m.sender, { 
        text: msg,
        mentions: [target] 
    })
}

handler.command = /^ip$/i
handler.group = true
handler.admin = true

export default handler
