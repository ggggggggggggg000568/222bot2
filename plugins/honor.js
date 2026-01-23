import fs from 'fs';

let handler = async (m, { conn }) => {
  const thumbnailBuffer = fs.readFileSync('./icone/admin.png'); // Assicurati che esista
  const newsletterJid = "120363419757666459@newsletter";
  const newsletterName = ' ꙰222 ꙰ 𝔹𝕆𝕋 ꙰ ✦';

  const owners = global.owner.filter(o => o && o[0]);
  const mentions = owners.map(([n]) => n + '@s.whatsapp.net');
  const ownerText = owners.map(([n, name]) => `➤ @${n} *${name || 'Owner'}*`).join('\n');

  const caption = `
╭─────────────◆
│ 𝐢𝐧𝐜𝐡𝐢𝐧𝐚𝐭𝐞𝐯𝐢 𝐭𝐮𝐭𝐭𝐢 𝐚𝐢 𝐯𝐨𝐬𝐭𝐫𝐢 𝐩𝐚𝐝𝐫𝐨𝐧𝐢
╰─────────────◆

${ownerText}
`.trim();

  const quoted = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: 'OwnerHighlight'
    },
    message: {
      locationMessage: {
        name: "𝟐𝟐𝟐 MΞИZIФИΞ D'ФИФЯΞ",
        jpegThumbnail: thumbnailBuffer,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Bot Owner\nORG:Team Unlimited\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  await conn.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      mentionedJid: mentions,
      
      
      
    }
  }, { quoted });
};

handler.help = ["onore"];
handler.tags = ["info"];
handler.command = /^(onore)$/i;
export default handler;