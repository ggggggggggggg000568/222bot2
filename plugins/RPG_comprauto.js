const cars = [
  // Auto economiche (city car e utilitarie)
  { id: 'panda', name: 'Fiat Panda', cost: 10000, desc: 'Auto piccola e pratica, perfetta per la città' },
  { id: 'ka', name: 'Ford Ka', cost: 12000, desc: 'Compatta ed economica' },
  { id: 'aygo', name: 'Toyota Aygo', cost: 15000, desc: 'Affidabile e con bassi consumi' },
  { id: 'sandero', name: 'Dacia Sandero', cost: 11000, desc: 'Essenziale ma spaziosa' },
  
  // Auto famiglia (medie e compatte)
  { id: 'golf', name: 'Volkswagen Golf', cost: 25000, desc: 'Classica compatta di qualità' },
  { id: 'focus', name: 'Ford Focus', cost: 23000, desc: 'Dinamica e confortevole' },
  { id: 'corolla', name: 'Toyota Corolla', cost: 28000, desc: 'Affidabilità giapponese' },
  { id: 'megane', name: 'Renault Megane', cost: 24000, desc: 'Design francese' },
  
  // Premium entry level
  { id: 'a3', name: 'Audi A3', cost: 35000, desc: 'Eleganza tedesca compatta' },
  { id: 'serie1', name: 'BMW Serie 1', cost: 38000, desc: 'Sportività in formato ridotto' },
  { id: 'cla', name: 'Mercedes CLA', cost: 40000, desc: 'Stile coupé a 4 porte' },
  
  // SUV e crossover
  { id: 'tiguan', name: 'VW Tiguan', cost: 40000, desc: 'SUV medio versatile' },
  { id: 'qashqai', name: 'Nissan Qashqai', cost: 32000, desc: 'Pioniere dei crossover' },
  { id: 'x1', name: 'BMW X1', cost: 45000, desc: 'SUV premium compatto' },
  
  // Auto sportive
  { id: 'm3', name: 'BMW M3', cost: 85000, desc: 'Berlina ad alte prestazioni' },
  { id: 'mustang', name: 'Ford Mustang', cost: 65000, desc: 'Icona muscle car americana' },
  { id: 'supra', name: 'Toyota Supra', cost: 75000, desc: 'Leggendaria sportiva giapponese' },
  { id: 'srt' , name: 'Srt Hellcat', cost: 65000, desc:'Auto Migliore'},
  // Auto di lusso
  { id: 'eclass', name: 'Mercedes E-Class', cost: 70000, desc: 'Lusso e tecnologia' },
  { id: 'a6', name: 'Audi A6', cost: 68000, desc: 'Executive raffinata' },
  { id: 'volvo90', name: 'Volvo S90', cost: 65000, desc: 'Sicurezza e design scandinavo' },
  
  // Elettriche
  { id: 'tesla3', name: 'Tesla Model 3', cost: 50000, desc: 'Elettrica accessibile' },
  { id: 'teslas', name: 'Tesla Model S', cost: 90000, desc: 'Prestazioni elettriche' },
  { id: 'ioniq5', name: 'Hyundai Ioniq 5', cost: 55000, desc: 'Design futuristico' },
  
  // Supercar
  { id: 'lamborghini', name: 'Lamborghini Huracan', cost: 250000, desc: 'Pura adrenalina italiana' },
  { id: 'ferrari', name: 'Ferrari 488 GTB', cost: 300000, desc: 'Cavallino rampante' },
  { id: 'bugatti', name: 'Bugatti Chiron', cost: 3000000, desc: 'L\'apice dell\'ingegneria automobilistica' },
  
  // Auto rare/iconiche
  { id: 'delorean', name: 'DeLorean DMC-12', cost: 80000, desc: 'Icona cinematografica' },
  { id: 'minicooper', name: 'Mini Cooper Classic', cost: 40000, desc: 'Stile british anni 60' },
  { id: 'jeep', name: 'Jeep Wrangler', cost: 50000, desc: 'Fuoristrada leggendario' }
]


const handler = async (m, { conn, args, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  
  // STEP 1: Lista auto con pulsanti
  if (!args[0]) {
    const buttons = cars.map(car => ({
      buttonId: `${usedPrefix}${command} ${car.id}`,
      buttonText: { displayText: `🚗 ${car.name}` },
      type: 1
    }))
    
    return await conn.sendMessage(m.chat, {
      text: `🏁 *CONCESSIONARIO AUTO*\n\nSeleziona un'auto per vedere i dettagli:`,
      footer: `💰 Il tuo saldo: $${user.money?.toLocaleString() || 0}`,
      buttons: buttons.concat([{
        buttonId: `${usedPrefix}saldo`,
        buttonText: { displayText: '💰 Verifica saldo' },
        type: 1
      }]),
      headerType: 1
    }, { quoted: m })
  }

  // STEP 2: Dettagli auto specifica
  const selected = cars.find(c => c.id === args[0].toLowerCase())
  if (!selected) return m.reply('🚫 Auto non trovata.')

  // Se è già stato specificato "compra"
  if (args[1] === 'compra') {
    if (user.money < selected.cost) {
      return await conn.sendMessage(m.chat, {
        text: `❌ *Fondi insufficienti!*\n\nPrezzo: $${selected.cost.toLocaleString()}\nIl tuo saldo: $${user.money?.toLocaleString() || 0}\n\nTi mancano: $${(selected.cost - user.money).toLocaleString()}`,
        footer: 'Digita .lavora per guadagnare più soldi!'
      }, { quoted: m })
    }
    
    user.money -= selected.cost
    user.auto = selected.name
    
    return await conn.sendMessage(m.chat, {
      text: `🎉 *ACQUISTO CONFERMATO!*\n\n🚗 *${selected.name}*\n💵 $${selected.cost.toLocaleString()}\n\n${selected.desc}\n\nGoditi il tuo nuovo veicolo!`,
      footer: `💰 Saldo rimanente: $${user.money.toLocaleString()}`
    }, { quoted: m })
  }

  // Mostra dettagli auto con pulsanti azione
  await conn.sendMessage(m.chat, {
    text: `🚗 *${selected.name}*\n\n💵 Prezzo: $${selected.cost.toLocaleString()}\n📝 Descrizione: ${selected.desc}\n\n💰 Il tuo saldo: $${user.money?.toLocaleString() || 0}`,
    footer: 'Scegli un\'azione:',
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

handler.help = ['compraauto', 'compraauto <id>']
handler.tags = ['economia']
handler.command = /^comprauto$/i
export default handler