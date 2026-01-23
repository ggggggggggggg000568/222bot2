const handler = async (event, { conn }) => {
  // Numero da bloccare (formato WhatsApp: senza spazi e senza +)
  const numeroBloccato = "393271329360";

  // Controlla se l'evento è di aggiunta di partecipanti
  if (event.action === "add") {
    for (let user of event.participants) {
      if (user.includes(numeroBloccato)) {
        await conn.groupParticipantsUpdate(event.id, [user], "remove");
        await conn.sendMessage(event.id, {
          text: `𝐔𝐬𝐞𝐫 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨 𝐫𝐢𝐜𝐨𝐧𝐨𝐬𝐜𝐢𝐮𝐭𝐨: @${user.split("@")[0]} 𝐞̀ 𝐬𝐭𝐚𝐭𝐨 𝐫𝐢𝐦𝐨𝐬𝐬𝐨.`,
          mentions: [user]
        });
      }
    }
  }
};

handler.event = "group-participants-update";

export default handler;