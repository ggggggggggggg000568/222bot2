// 🔇 Handler disattivato – impedisce messaggi automatici di promozione/demozione
export default {
  all: async function (m) {
    // Se è un evento di promozione (29) o demozione (30), non fare nulla
    if (m.messageStubType === 29 || m.messageStubType === 30) {
      return; // STOPPA COMPLETAMENTE I MESSAGGI AUTOMATICI
    }
  }
};
