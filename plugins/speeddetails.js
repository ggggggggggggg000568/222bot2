const handler = async (m, { conn }) => {
  const msg = `
📊 *DETTAGLI AVANZATI SPEEDTEST*

• Analisi server  
• Protocollo HTTPS attivo  
• Misurazione multi-thread  
• Configurazione client rilevata  
• Pacchetti min/max analizzati  
• Rete: interpretazione dinamica valori  

Questa sezione può essere personalizzata con info aggiuntive del tuo bot.
`;

  await conn.reply(m.chat, msg, m);
};

handler.command = /^speeddetails$/i;
export default handler;
