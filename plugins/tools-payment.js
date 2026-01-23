let handler = async (m, { conn }) => {
  const jid = m.chat;

  await conn.sendMessage(
    jid,
    {
      text: '💸 Clicca il bottone qui sotto per visualizzare le info di pagamento PIX!',
      interactiveButtons: [
        {
          name: 'payment_info',
          buttonParamsJson: JSON.stringify({
            payment_settings: [
              {
                type: "pix_static_code",
                pix_static_code: {
                  merchant_name: 'filo𖤍²²²',
                  key: '+393201448716',
                  key_type: 'PHONE' // PHONE || EMAIL || CPF || EVP
                }
              }
            ]
          })
        }
      ]
    }
  );
};

handler.command = ['pixpay', 'pagamento'];
handler.help = ['pixpay'];
handler.tags = ['tools'];

export default handler;