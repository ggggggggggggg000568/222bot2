const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  
  const text = `
🏰 *PROPRIETÀ E PATRIMONIO* 🏦

📜 *Dati personali*
┣ 👤 Nome: ${user.name || 'Non impostato'}
┣ 📅 Registrato: ${user.registrazione || 'Data sconosciuta'}
┗ 🆔 ID: ${m.sender.split('@')[0]}

💰 *Situazione finanziaria*
┣ 💵 Contanti: $${(user.money || 0).toLocaleString()}
┣ 🏦 Depositi: $${(user.bank || 0).toLocaleString()}
┗ 📈 Valore totale: $${((user.money || 0) + (user.bank || 0)).toLocaleString()}

🏡 *Proprietà immobiliari*
┣ 🏠 Residenza: ${user.casa || 'Nessuna'}
┣ 🏖️ Case vacanza: ${user.caseVacanza || 0}
┗ 🏢 Proprietà commerciali: ${user.proprietaCommerciali || 0}

🚗 *Parco veicoli*
┣ 🚘 Auto principale: ${user.auto || 'Nessuna'}
┣ � Motoveicoli: ${user.moto || 0}
┗ ✈️ Veicoli speciali: ${user.veicoliSpeciali || 0}

🎮 *Statistiche*
┣ ⚒️ Lavori completati: ${user.lavori || 0}
┣ 🛒 Acquisti: ${user.acquisti || 0}
┗ 📊 Livello: ${user.livello || 1}
`.trim()

  await conn.sendMessage(m.chat, { 
    text,
    footer: 'Digita .mercato per vedere le proprietà disponibili',
    headerType: 1
  }, { quoted: m })
}

handler.help = ['proprietà']
handler.tags = ['economia']
handler.command = /^(proprietà|proprieta|patrimonio|assets)$/i
export default handler