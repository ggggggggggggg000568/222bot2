let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `❌ Formato comando errato.\n\nUsa:\n${usedPrefix}${command} <orderId>;<count>;<status>;<titolo>;<messaggio>;<amount>;<valuta>\n\nEsempio:\n${usedPrefix}${command} 574001;3;INQUIRY;Ordine Speciale;Il tuo ordine è pronto!;50000;IDR`;
  }

  try {
    const [
      orderId,
      itemCount,
      status,
      orderTitle,
      message,
      totalAmount1000,
      totalCurrencyCode
    ] = args.join(" ").split(";");

    const orderMsg = {
      order: {
        orderId,
        thumbnail: null, // Puoi anche aggiungere un'immagine come Buffer se vuoi
        itemCount: parseInt(itemCount),
        status: status.toUpperCase(), // INQUIRY || ACCEPTED || DECLINED
        surface: 'CATALOG',
        message,
        orderTitle,
        sellerJid: conn.user.jid,
        token: 'random_token_123', // Può essere qualsiasi stringa
        totalAmount1000: parseInt(totalAmount1000),
        totalCurrencyCode
      }
    };

    await conn.sendMessage(m.chat, orderMsg, { quoted: m });
  } catch (err) {
    console.error(err);
    throw `⚠️ Errore nell'invio dell'ordine. Controlla il formato dei parametri.`;
  }
};

handler.help = ['ordina'];
handler.tags = ['tools'];
handler.command = /^ordina$/i;

export default handler;