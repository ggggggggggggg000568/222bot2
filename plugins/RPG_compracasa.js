const houses = [
  { id: 'tenda', name: '🏕️ Tenda da campeggio', cost: 500, desc: 'Soluzione economica, essenziale ma avventurosa.' },
  { id: 'roulotte', name: '🚐 Roulotte usata', cost: 5000, desc: 'Mobile e compatta, ideale per spiriti liberi.' },
  { id: 'capanna', name: '🌴 Capanna tropicale', cost: 9000, desc: 'Rustica, immersa nella natura. Ideale per chi ama la semplicità.' },
  { id: 'monolocale', name: '🏚️ Monolocale cittadino', cost: 15000, desc: 'Piccolo, ma ben posizionato in centro città.' },
  { id: 'bilocale', name: '🏠 Bilocale', cost: 30000, desc: 'Perfetto per single o giovani coppie.' },
  { id: 'appartamento', name: '🏢 Appartamento moderno', cost: 75000, desc: 'Spazioso, con tutti i comfort.' },
  { id: 'villetta', name: '🏡 Villetta a schiera', cost: 150000, desc: 'Con giardino e garage, per famiglie.' },
  { id: 'villa', name: '🏛️ Villa indipendente', cost: 500000, desc: 'Elegante, ampia e circondata dal verde.' },
  { id: 'mansion', name: '🏰 Mansion americana', cost: 1500000, desc: 'Una residenza lussuosa da sogno.' },
  { id: 'attico', name: '🌇 Attico di lusso', cost: 3000000, desc: 'Vista mozzafiato sulla città.' },
  { id: 'castello', name: '🏯 Castello medievale', cost: 10000000, desc: 'Una dimora storica senza tempo.' },
  { id: 'isola', name: '🏝️ Isola privata', cost: 50000000, desc: 'Il massimo del prestigio, solo per pochi.' },
  { id: 'yacht', name: '🛥️ Yacht extralusso', cost: 150000000, desc: 'Una casa galleggiante con ogni comfort.' }
]

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]

  // STEP 1: Lista case
  if (!args[0]) {
    const buttons = houses.map(house => ({
      buttonId: `${usedPrefix}${command} ${house.id}`,
      buttonText: { displayText: house.name },
      type: 1
    }))

    return await conn.sendMessage(m.chat, {
      text: `🏡 *AGENZIA IMMOBILIARE VIRTUALE*\n\n🎯 Scegli la proprietà dei tuoi sogni tra quelle disponibili qui sotto:\n\n📦 Ogni casa ha un prezzo e una descrizione unica.\n\nClicca per vedere i dettagli!`,
      footer: `acquista la tua casetta virtuale😁`,
      buttons: buttons.concat([{
        buttonId: `${usedPrefix}saldo`,
        buttonText: { displayText: '💰 Verifica saldo' },
        type: 1
      }]),
      headerType: 1
    }, { quoted: m })
  }

  // STEP 2: Dettagli della casa selezionata
  const selected = houses.find(h => h.id === args[0].toLowerCase())
  if (!selected) return m.reply('🚫 *Proprietà non trovata.*\nVerifica l\'ID della casa.')

  // STEP 3: Acquisto
  if (args[1] === 'compra') {
    if (user.money < selected.cost) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Fondi insufficienti!*\n\n🏠 Prezzo: $${selected.cost.toLocaleString()}\n💸 Il tuo saldo: $${user.money?.toLocaleString() || 0}\n\n📉 Ti mancano: $${(selected.cost - user.money).toLocaleString()}`,
        footer: '💼 Suggerimento: digita *.lavora* per guadagnare denaro extra!'
      }, { quoted: m })
    }

    user.money -= selected.cost
    user.casa = selected.name

    return await conn.sendMessage(m.chat, {
      text: `🔑 *ACQUISTO COMPLETATO!*\n\n🏠 Hai acquistato: *${selected.name}*\n💵 Prezzo: $${selected.cost.toLocaleString()}\n📜 Descrizione: ${selected.desc}\n\n🎉 Complimenti! Benvenuto nella tua nuova casa!`,
      footer: `💰 Saldo rimanente: $${user.money.toLocaleString()}`
    }, { quoted: m })
  }

  // STEP 4: Mostra dettagli casa
  return await conn.sendMessage(m.chat, {
    text: `🏠 *${selected.name}*\n\n💵 *Prezzo:* $${selected.cost.toLocaleString()}\n📝 *Descrizione:* ${selected.desc}\n\n💰 *Il tuo saldo:* $${user.money?.toLocaleString() || 0}`,
    footer: '✨ Cosa vuoi fare?',
    buttons: [
      {
        buttonId: `${usedPrefix}${command} ${selected.id} compra`,
        buttonText: { displayText: '✅ Compra ora' },
        type: 1
      },
      {
        buttonId: `${usedPrefix}${command}`,
        buttonText: { displayText: '🔙 Torna alla lista' },
        type: 1
      },
      {
        buttonId: `${usedPrefix}saldo`,
        buttonText: { displayText: '💰 Verifica saldo' },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.help = ['compracasa', 'compracasa <id>']
handler.tags = ['economia']
handler.command = /^compracasa$/i
export default handler