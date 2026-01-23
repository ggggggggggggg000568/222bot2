const handler = async (m, { conn, args, command, usedPrefix }) => {
  // Database utente
  const user = global.db.data.users[m.sender]
  user.shop = user.shop || {}
  
  // Lista oggetti completa con emoji
  const shopItems = {
    volpe: { price: 600, emoji: '🦊' },
    lupo: { price: 800, emoji: '🐺' },
    panda: { price: 1500, emoji: '🐼' },
    tigre: { price: 2000, emoji: '🐅' },
    peluche: { price: 200, emoji: '🧸' },
    peluche_gatto: { price: 300, emoji: '🐱' },
    unicorno: { price: 2500, emoji: '🦄' },
    drago: { price: 3500, emoji: '🐉' },
    pozione: { price: 150, emoji: '🧪' },
    pozione_curativa: { price: 300, emoji: '❤️‍🩹' },
    spada: { price: 800, emoji: '⚔️' },
    diamante: { price: 3000, emoji: '💎' },
    mela: { price: 50, emoji: '🍎' },
    torta: { price: 200, emoji: '🍰' },
    trofeo: { price: 10000, emoji: '🏆' },
    corona: { price: 8000, emoji: '👑' }
  }

  // Mostra negozio con pulsanti
  if (command === 'compra' && !args[0]) {
    let shopText = `🛍️ *NEGOZIO* 🛍️\n\n💰 Il tuo saldo: *${user.money}€*\n\n`
    shopText += 'Seleziona cosa vuoi comprare:\n\n'
    
    const buttons = Object.entries(shopItems).map(([name, item]) => {
      return {
        buttonId: `${usedPrefix}compra ${name}`,
        buttonText: { displayText: `${item.emoji} ${name} - ${item.price}€` },
        type: 1
      }
    })
    
    // Aggiungi pulsante per l'inventario
    buttons.push({
      buttonId: `${usedPrefix}inventario`,
      buttonText: { displayText: '🎒 Inventario' },
      type: 1
    })
    
    return await conn.sendMessage(m.chat, {
      text: shopText,
      footer: 'Clicca su un oggetto per comprarlo',
      buttons: buttons,
      headerType: 1
    })
  }

  // Comando compra [oggetto]
  if (command === 'compra' && args[0]) {
    const itemName = args[0].toLowerCase()
    const item = shopItems[itemName]
    
    if (!item) return m.reply('❌ Oggetto non valido! Usa *compra* per vedere la lista')
    
    if (user.money < item.price) {
      return m.reply(`💸 Soldi insufficienti! Ti servono ${item.price}€ ma hai solo ${user.money}€`)
    }
    
    user.money -= item.price
    user.shop[itemName] = (user.shop[itemName] || 0) + 1
    
    return m.reply(`✅ Hai comprato ${item.emoji} *${itemName}* per ${item.price}€!\nOra ne hai ${user.shop[itemName]}`)
  }

  // Mostra inventario
  if (command === 'inventario' || command === 'zaino') {
    if (Object.keys(user.shop).length === 0) {
      return m.reply('🛍️ Il tuo inventario è vuoto! Usa *compra* per fare acquisti')
    }
    
    let invText = `🎒 *INVENTARIO* 🎒\n\n💰 Saldo: ${user.money}€\n\n`
    
    for (const [item, qty] of Object.entries(user.shop)) {
      const emoji = shopItems[item]?.emoji || '🎁'
      invText += `${emoji} *${item}:* ${qty}\n`
    }
    
    // Aggiungi pulsanti
    const buttons = [
      { buttonId: `${usedPrefix}compra`, buttonText: { displayText: '🛍️ Negozio' }, type: 1 },
      { buttonId: `${usedPrefix}vendi`, buttonText: { displayText: '💰 Vendi' }, type: 1 }
    ]
    
    return await conn.sendMessage(m.chat, {
      text: invText,
      footer: 'Cosa vuoi fare?',
      buttons: buttons,
      headerType: 1
    })
  }

  // Comando vendi
  if (command === 'vendi') {
    // ... (qui puoi aggiungere la logica per vendere)
    return m.reply('⚠️ Sistema di vendita in sviluppo')
  }
}

handler.help = ['compra', 'inventario', 'vendi [oggetto] [quantità] @utente']
handler.tags = ['economy']
handler.command = /^(compra|shop|inventario|zaino|vendi)$/i

export default handler