import fetch from 'node-fetch';

// Para configurar o idioma, na raiz do projeto altere o arquivo config.json
// Para configurar el idioma, en la raíz del proyecto, modifique el archivo config.json.
// To set the language, in the root of the project, modify the config.json file.

const handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems }) => {

  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  try {
    const datas = global
    const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
    const tradutor = _translate.plugins.menu_menu
    // const pp = imagen7;

    // let vn = './src/assets/audio/01J673Y3TGCFF1D548242AX68Q.mp3'

    const d = new Date(new Date + 3600000);
    const locale = 'es-ES';
    const week = d.toLocaleDateString(locale, { weekday: 'long' });
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const user = global.db.data.users[m.sender];
    const { money, joincount } = global.db.data.users[m.sender];
    const { exp, limit, level, role } = global.db.data.users[m.sender];
    const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
    const rtotal = Object.entries(global.db.data.users).length || '0'
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const document = doc[Math.floor(Math.random() * doc.length)];
    const str = `${tradutor.texto1[0]}

${tradutor.texto1[1]} ${taguser}

${tradutor.texto1[2]}

${tradutor.texto1[9]} ${user.premiumTime > 0 ? '✅' : (isPrems ? '✅' : '❌') || ''}
 ${readMore}

 ${tradutor.texto1[17]}
 >_${usedPrefix}add *num>*_
  _${usedPrefix}kick *<@tag>*_
  _${usedPrefix}kick2 *<@tag>*_
  _${usedPrefix}listanum *<txt>*_
  _${usedPrefix}kicknum *<txt>*_
  _${usedPrefix}grupo *<abrir/cerrar>*_
  _${usedPrefix}grouptime ${tradutor.texto1[30]}
  _${usedPrefix}promote *<@tag>*_
  _${usedPrefix}demote *<@tag>*_
  _${usedPrefix}infogroup_
  _${usedPrefix}resetlink_
  _${usedPrefix}link_
  _${usedPrefix}setname *<txt>*_
  _${usedPrefix}setdesc *<txt>*_
  _${usedPrefix}invocar *<txt>*_
  _${usedPrefix}setwelcome *<txt>*_
  _${usedPrefix}setbye *<txt>*_
  _${usedPrefix}hidetag *<txt>*_
  _${usedPrefix}hidetag *<audio>*_
  _${usedPrefix}hidetag *<video>*_
  _${usedPrefix}hidetag *<img>*_
  _${usedPrefix}warn *<@tag>*_
  _${usedPrefix}unwarn *<@tag>*_
  _${usedPrefix}listwarn_
  _${usedPrefix}fantasmas_
  _${usedPrefix}destraba_
  _${usedPrefix}setpp *<img>*_
  _admins *<txt>*_ ${tradutor.texto1[31]}
 ╰───── • ◆ • ─────╯
${tradutor.texto1[24]}


 ${tradutor.texto1[28]}

 
  _> *<funcion>*_
  _=> *<funcion>*_
  _$ *<funcion>*_
  _${usedPrefix}dsowner_
  _${usedPrefix}setprefix *<prefijo>*_
  _${usedPrefix}resetprefix_
  _${usedPrefix}autoadmin_
  _${usedPrefix}grouplist_
  _${usedPrefix}leavegc_
  _${usedPrefix}blocklist_
  _${usedPrefix}addowner *<@tag / num>*_
  _${usedPrefix}delowner *<@tag / num>*_
  _${usedPrefix}block *<@tag / num>*_
  _${usedPrefix}unblock *<@tag / num>*_
  _${usedPrefix}enable *restrict*_
  _${usedPrefix}disable *restrict*_
  _${usedPrefix}enable *autoread*_
  _${usedPrefix}disable *autoread*_
  _${usedPrefix}enable *public*_
  _${usedPrefix}disable *public*_
  _${usedPrefix}enable *pconly*_
  _${usedPrefix}disable *pconly*_
  _${usedPrefix}enable *gconly*_
  _${usedPrefix}disable *gconly*_
  _${usedPrefix}enable *anticall*_
  _${usedPrefix}disable *anticall*_
  _${usedPrefix}enable *antiprivado*_
  _${usedPrefix}disable *antiprivado*_
  _${usedPrefix}enable *modejadibot*_
  _${usedPrefix}disable *modejadibot*_
  _${usedPrefix}enable *audios_bot*_
  _${usedPrefix}disable *audios_bot*_
  _${usedPrefix}enable *antispam*_
  _${usedPrefix}disable *antispam*_
  _${usedPrefix}msg *<txt>*_
  _${usedPrefix}banchat_
  _${usedPrefix}unbanchat_
  _${usedPrefix}resetuser *<@tag>*_
  _${usedPrefix}banuser *<@tag>*_
  _${usedPrefix}unbanuser *<@tag>*_
  _${usedPrefix}banuser *<@tag>*_
  _${usedPrefix}cleartpm_
  _${usedPrefix}restart_
  _${usedPrefix}update_
  _${usedPrefix}banlist_
  _${usedPrefix}delprem *<@tag>*_
  _${usedPrefix}listcmd_
  _${usedPrefix}setppbot *<reply to img>*_
  _${usedPrefix}addcmd *<txt>*_
  _${usedPrefix}delcmd_
  _${usedPrefix}saveimage_
  _${usedPrefix}viewimage_
 `
 let pp
    // Nuevas Imágenes del menu para otros idiomas
    if (idioma == 'es') {
      pp = global.imagen1
    } else if (idioma == 'pt-br') {
      pp = global.imagen2
    } else if (idioma == 'fr') {
      pp = global.imagen3
    }else if (idioma == 'en') {
      pp = global.imagen4
    } else if (idioma == 'ru') {
      pp = global.imagen5
    } else {
      pp = global.imagen1 // Imagen por defecto (Español/Spanish)
    }
    

    


    if (m.isGroup) {
      // await conn.sendFile(m.chat, vn, './src/assets/audio/01J673Y3TGCFF1D548242AX68Q.mp3', null, m, true, { type: 'audioMessage', ptt: true})
      conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: m });
    } else {
      //await conn.sendFile(m.chat, vn, './src/assets/audio/01J673Y3TGCFF1D548242AX68Q.mp3', null, m, true, { type: 'audioMessage', ptt: true})
      const fkontak = { key: { participants:"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { " contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender .split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
      conn.sendMessage(m.chat, { image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net') }, { quoted: fkontak });
    }
  } catch {
    const datas = global
    const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
    const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
    const tradutor = _translate.plugins.menu_menu
    
    conn.reply(m.chat, translator.texto1[29], m);
  }
};
handler.command = /^(menu|help|comandos|commands|cmd|cmds)$/i;
handler.exp = 50;
handler.fail = null;
export default handler;
function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
      }
