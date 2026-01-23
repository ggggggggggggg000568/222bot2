let handler = async (m, { conn }) => {
  const jid = m.chat;

  await conn.sendMessage(
    jid,
    {
      text: '🛍️ Dai un’occhiata alla nostra vetrina esclusiva!',
      title: '🛒 222 SHOP',
      subtitle: 'Scopri i prodotti disponibili ora!',
      footer: 'Tocca per aprire il catalogo ufficiale',
      shop: {
        surface: 4, // Grande visualizzazione
        id: 'https://wa.me/c/393201448716' // Tuo catalogo
      },
      viewOnce: true
    }
  );
};

handler.command = ['shop', 'catalogo', 'megashop'];
handler.help = ['shop'];
handler.tags = ['ecommerce'];

export default handler;