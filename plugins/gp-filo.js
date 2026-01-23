let handler = async (m, { conn, command, text }) => {
    let love = `
____________
|        _______|
|       |_______
|        _______|
|       |
|       |
| ___ |

 ___
|     |
|     |
|     |
|     |
|___|

 ___
|     |
|     |
|     |
|     |_____
| ________|
 ___________
|                   |
|        __        |
|       |__|       |
|                   |
|___________ |
✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯︎︎︎

🌟 𝕕𝕚 Filo 🌟`.trim(); // Chiude correttamente il backtick e applica trim per eliminare spazi inutili

    m.reply(love, null, { mentions: conn.parseMention(love) });
};

handler.command = /^(22king)$/i;
export default handler;