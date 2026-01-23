let handler = async (m, { conn, command, text }) => {
    let love = `
____      
|\\   ____\\     
\\ \\  \\___|_    
 \\ \\_____  \\   
  \\|____|\\  \\  
    ____\\_\\  \\ 
   |\\_________\\
   \\|_________|               
 _      _ 
|\\  \\    /  /|
\\ \\  \\  /  / / 
 \\ \\  \\/  / /  
  \\ \\    / /  
   \\ \\__/ /   
    \\|__|/    
              
 ____     
|\\   __  \\    
\\ \\  \\|\\  \\   
 \\ \\  \\\\\\  \\  
  \\ \\  \\\\\\  \\ 
   \\ \\_______\\
    \\|_______|

✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯ ✯︎︎︎

🌟 𝕕𝕚 Svo 🌟`.trim(); // Chiude correttamente il backtick e applica trim per eliminare spazi inutili

    m.reply(love, null, { mentions: conn.parseMention(love) });
};

handler.command = /^(svo)$/i;
export default handler;