const handler = async (m, { conn }) => {
  const sections = [
    {
      title: "📚 Articoli disponibili",
      rows: [
        {
          title: "🟢 WhatsApp Surveys",
          description: "Cos'è e come funziona il sistema Survey",
          rowId: "link_whatsapp_surveys"
        },
        {
          title: "📞 Problemi con la verifica",
          description: "Non riesci a verificare il numero?",
          rowId: "link_verifica_numero"
        },
        {
          title: "🔒 Sicurezza dell'account",
          description: "Proteggere il tuo account WhatsApp",
          rowId: "link_sicurezza"
        }
      ]
    }
  ];

  const listMessage = {
    text: "Seleziona un argomento per visualizzare l'articolo:",
    footer: "Centro Assistenza WhatsApp",
    title: "🔍 Scopri di più",
    buttonText: "Apri elenco 📑",
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = ['scopri'];
handler.group = false;
handler.help = ['scopri'];
handler.tags = ['info'];

export default handler;