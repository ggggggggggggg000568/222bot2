const pinQueue = new Map(); // per memorizzare i messaggi in attesa di scelta durata
const activePins = new Map(); // per memorizzare i pin con scadenza

const handler = {
  async before(m, { conn }) {
    if (!m.isGroup) return;

    // Recupera testo o ID dei pulsanti
    let text = m.text?.trim();
    if (!text && m.message?.templateButtonReplyMessage) {
      text = m.message.templateButtonReplyMessage.selectedId;
    }
    if (!text) return;

    // ======================
    // COMANDO !pin
    // ======================
    if (text === '!pin') {
      if (!m.quoted) {
        return conn.sendMessage(m.chat, {
          text: '⚠️ Rispondi a un messaggio per fissarlo.'
        }, { quoted: m });
      }

      // Salva il messaggio da pinnare
      pinQueue.set(m.chat, m.quoted);

      await conn.sendMessage(m.chat, {
        text: '📌 *Scegli per quanto tempo vuoi fissare il messaggio:*',
        footer: '✦ Seleziona una durata:',
        templateButtons: [
          { index: 1, quickReplyButton: { displayText: '⏳ 1 Giorno', id: '!pin1d' } },
          { index: 2, quickReplyButton: { displayText: '⏳ 7 Giorni', id: '!pin7d' } },
          { index: 3, quickReplyButton: { displayText: '⏳ 30 Giorni', id: '!pin30d' } }
        ]
      }, { quoted: m });

      return;
    }

    // ======================
    // GESTIONE PIN CON DURATA
    // ======================
    if (['!pin1d', '!pin7d', '!pin30d'].includes(text)) {
      const quoted = pinQueue.get(m.chat);
      if (!quoted) {
        return conn.sendMessage(m.chat, {
          text: '❌ Nessun messaggio da fissare. Usa prima !pin rispondendo a un messaggio.'
        }, { quoted: m });
      }

      let durationMs = 0;
      let durationText = '';
      
      if (text === '!pin1d') {
        durationMs = 1 * 24 * 60 * 60 * 1000;
        durationText = '1 giorno';
      } else if (text === '!pin7d') {
        durationMs = 7 * 24 * 60 * 60 * 1000;
        durationText = '7 giorni';
      } else if (text === '!pin30d') {
        durationMs = 30 * 24 * 60 * 60 * 1000;
        durationText = '30 giorni';
      }

      try {
        // PIN effettivo
        await conn.groupPinMessage(m.chat, quoted.key);

        await conn.sendMessage(m.chat, {
          text: `✅ Messaggio fissato per ${durationText}`,
          footer: '✦ Altri comandi:',
          templateButtons: [
            { index: 1, quickReplyButton: { displayText: '📌 Rimuovi fissato', id: '!unpin' } }
          ]
        }, { quoted: m });

        // Pianifica rimozione automatica
        const timeout = setTimeout(async () => {
          try {
            await conn.groupUnpinMessage(m.chat, quoted.key);
            await conn.sendMessage(m.chat, {
              text: `⏳ Il messaggio fissato è stato rimosso automaticamente dopo ${durationText}.`
            });
          } catch (err) {
            console.error('[ERRORE AUTO-UNPIN]', err);
          }
        }, durationMs);

        // Salva pin attivo
        activePins.set(m.chat, { key: quoted.key, timeout });

        // Pulisci la coda
        pinQueue.delete(m.chat);

      } catch (e) {
        console.error('[ERRORE PIN]', e);
        await conn.sendMessage(m.chat, {
          text: '❌ Errore nel fissare il messaggio.'
        }, { quoted: m });
      }
      return;
    }

    // ======================
    // GESTIONE UNPIN MANUALE
    // ======================
    if (['!unpin', '!destacar', '!desmarcar'].includes(text)) {
      if (!m.quoted) {
        return conn.sendMessage(m.chat, {
          text: `⚠️ Rispondi a un messaggio per ${text === '!unpin' ? 'rimuoverlo dai fissati' : 'eseguire l\'azione'}.`
        }, { quoted: m });
      }

      try {
        switch (text) {
          case '!unpin':
            await conn.groupUnpinMessage(m.chat, m.quoted.key);
            break;
          case '!destacar':
            await conn.sendMessage(m.chat, { keep: { key: m.quoted.key, type: 1 } });
            break;
          case '!desmarcar':
            await conn.sendMessage(m.chat, { keep: { key: m.quoted.key, type: 2 } });
            break;
        }

        // Se c'era un timeout programmato, lo annulla
        if (activePins.has(m.chat)) {
          clearTimeout(activePins.get(m.chat).timeout);
          activePins.delete(m.chat);
        }

        await conn.sendMessage(m.chat, {
          text: '✅ Operazione completata con successo'
        }, { quoted: m });

      } catch (err) {
        console.error('[ERRORE UNPIN]', err);
        await conn.sendMessage(m.chat, {
          text: '❌ Errore nell\'eseguire il comando.'
        }, { quoted: m });
      }
      return;
    }
  }
};

export default handler;