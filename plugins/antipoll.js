export async function before(msg, { isAdmin, isBotAdmin }) {
  if (msg.isBaileys || !msg.isGroup) return true;

  // Funzione per rilevare link
  const hasLinks = (text) => /https?:\/\/[^\s]+/gi.test(text || "");

  if (msg.message?.pollCreationMessageV3) {
    const poll = msg.message.pollCreationMessageV3;
    const hasLink = hasLinks(poll.name) || 
                   (poll.options || []).some(opt => hasLinks(opt.optionName));

    if (hasLink && isBotAdmin) {
      try {
        // 1. Elimina il sondaggio
        await this.sendMessage(msg.chat, {
          delete: {
            remoteJid: msg.chat,
            id: msg.key.id,
            participant: msg.key.participant
          }
        });

        // 2. ESPELLE l'utente (sintassi corretta)
        await this.groupParticipantsUpdate(
          msg.chat, 
          [msg.key.participant], 
          "remove"
        );

        // 3. Notifica
        await this.sendMessage(
          msg.chat,
          { 
            text: `🚫 Utente rimosso per aver inserito link nel sondaggio!`,
            mentions: [msg.key.participant]
          }
        );

      } catch (error) {
        console.error("Errore:", error);
      }
      return false;
    }
  }
  return true;
}