const handler = async (m, { args, usedPrefix, command }) => {
  if (args.length < 2) {
    return m.reply(`❌ 𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:\n${usedPrefix}${command} <età> <genere>\n📌 Esempio: *${usedPrefix}${command} 25 maschio*`);
  }

  const age = parseInt(args[0]);
  const genereInput = args[1]?.toLowerCase();

  if (isNaN(age) || age <= 0 || age > 999) {
    return m.reply("⚠️ 𝐄𝐭𝐚̀ 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐚. Inserisci un numero tra 1 e 999.");
  }

  const generiValidi = ['maschio', 'femmina', 'transformer'];
  if (!generiValidi.includes(genereInput)) {
    return m.reply("⚠️ 𝐆𝐞𝐧𝐞𝐫𝐞 𝐧𝐨𝐧 𝐯𝐚𝐥𝐢𝐝𝐨. Usa uno di questi:\n- maschio\n- femmina\n- transformer");
  }

  const user = global.db.data.users[m.sender];
  user.age = age;
  user.genere = genereInput;

  return m.reply(`✅ 𝐏𝐫𝐨𝐟𝐢𝐥𝐨 𝐚𝐠𝐠𝐢𝐨𝐫𝐧𝐚𝐭𝐨:\n🗓️ Età: *${age}*\n🚻 Genere: *${genereInput}*`);
};

handler.help = ['setprofilo <età> <genere>'];
handler.tags = ['info'];
handler.command = /^(setprofilo|setage|setgenere)$/i;

export default handler;