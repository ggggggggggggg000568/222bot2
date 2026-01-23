const handler = async (m, { conn }) => {
  const jid = m.chat;

  await conn.sendMessage(
    jid,
    {
      text: '🧪 *Questo è un test completo di tutti i bottoni interattivi!*',
      title: '🔘 Bottoni Test',
      subtitle: '📌 Test avanzato',
      footer: '🤖 Powered by Baileys',

      interactiveButtons: [
        {
          name: 'quick_reply',
          buttonParamsJson: JSON.stringify({
            display_text: '📩 Rispondi!',
            id: 'quick_reply_id'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🌐 Vai al sito',
            url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y',
            merchant_url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
          })
        },
        {
          name: 'cta_copy',
          buttonParamsJson: JSON.stringify({
            display_text: '📋 Copia link',
            copy_code: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
          })
        },
        {
          name: 'cta_call',
          buttonParamsJson: JSON.stringify({
            display_text: '📞 Chiama',
            phone_number: '+393471234567'
          })
        },
        {
          name: 'cta_catalog',
          buttonParamsJson: JSON.stringify({
            business_phone_number: '+393471234567'
          })
        },
        {
          name: 'cta_reminder',
          buttonParamsJson: JSON.stringify({
            display_text: '⏰ Ricordamelo'
          })
        },
        {
          name: 'cta_cancel_reminder',
          buttonParamsJson: JSON.stringify({
            display_text: '❌ Annulla promemoria'
          })
        },
        {
          name: 'address_message',
          buttonParamsJson: JSON.stringify({
            display_text: '📍 Indirizzo'
          })
        },
        {
          name: 'send_location',
          buttonParamsJson: JSON.stringify({
            display_text: '📌 Invia posizione'
          })
        },
        {
          name: 'open_webview',
          buttonParamsJson: JSON.stringify({
            title: '🖥️ Apri WebView',
            link: {
              in_app_webview: true,
              url: 'https://whatsapp.com/channel/0029Vag9VSI2ZjCocqa2lB1y'
            }
          })
        },
        {
          name: 'mpm',
          buttonParamsJson: JSON.stringify({
            product_id: '8816262248471474'
          })
        },
        {
          name: 'wa_payment_transaction_details',
          buttonParamsJson: JSON.stringify({
            transaction_id: '12345848'
          })
        },
        {
          name: 'automated_greeting_message_view_catalog',
          buttonParamsJson: JSON.stringify({
            business_phone_number: '+393471234567',
            catalog_product_id: '12345'
          })
        },
        {
          name: 'galaxy_message',
          buttonParamsJson: JSON.stringify({
            mode: 'published',
            flow_message_version: '3',
            flow_token: '1:1307913409923914:293680f87029f5a13d1ec5e35e718af3',
            flow_id: '1307913409923914',
            flow_cta: '🪐 Galaxy CTA',
            flow_action: 'navigate',
            flow_action_payload: {
              screen: 'QUESTION_ONE',
              params: {
                user_id: '123456789',
                referral: 'campaign_xyz'
              }
            },
            flow_metadata: {
              flow_json_version: '201',
              data_api_protocol: 'v2',
              flow_name: 'Lead Qualification [en]',
              data_api_version: 'v2',
              categories: ['Lead Generation', 'Sales']
            }
          })
        },
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '🧾 Scegli un’opzione',
            sections: [
              {
                title: '📚 Sezione 1',
                highlight_label: '🔥 In evidenza',
                rows: [
                  {
                    header: '🟢 Opzione 1',
                    title: 'Prima scelta',
                    description: 'Descrizione prima',
                    id: 'scelta_1'
                  },
                  {
                    header: '🔵 Opzione 2',
                    title: 'Seconda scelta',
                    description: 'Descrizione seconda',
                    id: 'scelta_2'
                  }
                ]
              }
            ]
          })
        }
      ]
    },
    { quoted: m }
  );
};

handler.command = ['testbottoni', 'allbtn'];
handler.help = ['testbottoni'];
handler.tags = ['dev', 'fun'];

export default handler;