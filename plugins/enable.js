// enable.js versione non offuscata by 222 bot
import fs from 'fs';
import fetch from 'node-fetch';

async function handler(m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) {
    const chat = m.chat;
    const user = m.sender;
    const isEnable = /true|enable|attiva|(turn)?on|1/i.test(command);
    const chatData = global.db.data.chats[chat];
    const userData = global.db.data.users[user];
    const botData = global.db.data.settings[conn.user.jid] || {};
    const feature = (args[0] || '').toLowerCase();
    let isAll = false;
    let isUser = false;

    const menuText = `> 𝐃𝐢𝐠𝐢𝐭𝐚 ${usedPrefix}𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢 𝐩𝐞𝐫 𝐥𝐚 𝐥𝐢𝐬𝐭𝐚 𝐝𝐞𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢 𝐚𝐭𝐭𝐢𝐯𝐚𝐛𝐢𝐥𝐢 / 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐛𝐢𝐥𝐢`.toLowerCase();
    
    const menuItems = [{
        title: null,
        rows: [
            { title: '𝐦𝐨𝐝𝐨𝐚𝐝𝐦𝐢𝐧', description: null, rowId: usedPrefix + 'modoadmin' },
            { title: '𝐝𝐞𝐭𝐞𝐜𝐭', description: null, rowId: usedPrefix + 'detect' },
            { title: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐡𝐚𝐫𝐝', description: null, rowId: usedPrefix + 'antilinkhard' },
            { title: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤', description: null, rowId: usedPrefix + 'antilink' },
            { title: '𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤𝐠𝐩', description: null, rowId: usedPrefix + 'antilinkgp' },
            { title: '𝐚𝐧𝐭𝐢𝐞𝐥𝐢𝐦𝐢𝐧𝐚', description: null, rowId: usedPrefix + 'antielimina' },
            { title: '𝐚𝐧𝐭𝐢𝐯𝐢𝐞𝐰𝐨𝐧𝐜𝐞', description: null, rowId: usedPrefix + 'antiviewonce' },
            { title: '𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦', description: null, rowId: usedPrefix + 'antispam' },
            { title: '𝐚𝐧𝐭𝐢𝐭𝐫𝐚𝐯𝐚', description: null, rowId: usedPrefix + 'antitrava' },
            { title: '𝐚𝐧𝐭𝐢𝐩𝐚𝐤𝐢', description: null, rowId: usedPrefix + 'antipaki' },
            { title: '𝐚𝐮𝐭𝐨𝐬𝐭𝐢𝐜𝐤𝐞𝐫', description: null, rowId: usedPrefix + 'autosticker' }
        ]
    }];

    let chatName = await conn.getName(m.sender);
    let buttonText = 'Admin ' + chatName;
    
    const menu = {
        text: '𝐀𝐓𝐓𝐈𝐕𝐀/𝐃𝐈𝐒𝐀𝐓𝐓𝐈𝐕𝐀',
        footer: null,
        title: null,
        buttonText: buttonText,
        sections: menuItems
    };

    switch (feature) {
        case 'modoadmin':
            if (m.isGroup) {
                if (!isAdmin) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            } else {
                if (!isOwner) {
                    global.dfail('owner', m, conn);
                    throw false;
                }
            }
            chatData.modoadmin = isEnable;
            break;
            
        case 'detect':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.detect = isEnable;
            break;
            
        case 'antilink':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiLink = isEnable;
            break;
            
        case 'antilinkhard':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antilinkhard = isEnable;
            break;
            
        case 'antilinkgp':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antilinkgp = isEnable;
            break;
            
        case 'bestemmiometro':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.bestemmiometro = isEnable;
            break;
            
        case 'comandieseguiti':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.comandieseguiti = isEnable;
            break;
            
        case 'antielimina':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antielimina = isEnable;
            break;
            
        case 'antiprivato':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            global.opts.antiPrivate = !isEnable;
            break;
            
        case 'antipaki':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antipaki = isEnable;
            break;
            
        case 'antitrava':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antitrava = isEnable;
            break;
            
        case 'autosticker':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.autosticker = isEnable;
            break;
            
        case 'antispam':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antispam = isEnable;
            break;
            
        case 'antiviewonce':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiviewonce = isEnable;
            break;
            
        case 'antitiktok':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antitiktok = isEnable;
            break;
            
        case 'antitelegram':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antitelegram = isEnable;
            break;
            
        case 'antiinsta':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiinsta = isEnable;
            break;
            
        case 'antiporno':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiporno = isEnable;
            break;
            
        case 'antiarab':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiarab = isEnable;
            break;
            
        case 'antitiktok':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antitiktok = isEnable;
            break;
            
        case 'gconly':
            isAll = true;
            if (!isOwner) {
                global.dfail('owner', m, conn);
                throw false;
            }
            botData.gconly = isEnable;
            break;
            
        case 'pconly':
            isAll = true;
            if (!isOwner) {
                global.dfail('owner', m, conn);
                throw false;
            }
            botData.pconly = isEnable;
            break;
            
        case 'autoread':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            global.opts.autoRead = isEnable;
            break;
            
        case 'restrict':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            global.opts.restrict = isEnable;
            break;
            
        case 'statusonly':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            botData.statusonly = isEnable;
            break;
            
        case 'swonly':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            global.opts.swonly = isEnable;
            break;
            
        case 'jadibot':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            botData.jadibot = isEnable;
            break;
            
        case 'public':
            isAll = true;
            if (!isROwner) {
                global.dfail('rowner', m, conn);
                throw false;
            }
            global.opts.public = isEnable;
            break;
            
        case 'self':
            isAll = true;
            if (!isOwner) {
                global.dfail('owner', m, conn);
                throw false;
            }
            botData.self = isEnable;
            break;
            
        case 'benvenuto':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.welcome = isEnable;
            break;
            
        case 'delete':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.delete = isEnable;
            break;
            
        case 'antilinkbase':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antilinkbase = isEnable;
            break;
            
        case 'antilinkbase2':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antilinkbase2 = isEnable;
            break;
            
        case 'risposte':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.risposte = isEnable;
            break;
            
        case 'antiCall':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiCall = isEnable;
            break;
            
        case 'gpt':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.gpt = isEnable;
            break;
            
        case 'chatgpt':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.chatgpt = isEnable;
            break;
            
        case 'audios':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.audios = isEnable;
            break;
            
        case 'soloprivato':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.soloprivato = isEnable;
            break;
            
        case 'sologruppo':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.sologruppo = isEnable;
            break;
            
        case 'antiyt':
            if (m.isGroup) {
                if (!isAdmin && !isOwner) {
                    global.dfail('admin', m, conn);
                    throw false;
                }
            }
            chatData.antiyt = isEnable;
            break;
            
        default:
            if (!/[01]/.test(command)) {
                return await conn.sendMessage(m.chat, { 
                    text: menuText,
                    footer: 'Seleziona una funzione dal menu qui sotto',
                    title: "𝐌𝐄𝐍𝐔 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈",
                    buttonText: "📋 Lista Funzioni",
                    sections: menuItems
                }, { quoted: m });
            }
            throw false;
    }

    // Crea il pulsante per attivare/disattivare
    const toggleAction = isEnable ? 'disabilita' : 'attiva';
    const toggleButton = {
        buttonText: `${isEnable ? '🔴 Disattiva' : '🟢 Attiva'}`,
        buttons: [
            { buttonId: `${usedPrefix}${toggleAction} ${feature}`, buttonText: { displayText: `${isEnable ? '🔴 Disattiva' : '🟢 Attiva'}` }, type: 1 }
        ]
    };

    // Invia il messaggio con il pulsante
    await conn.sendMessage(m.chat, { 
        text: `𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 » ${feature}\n𝐒𝐭𝐚𝐭𝐨 » ${isEnable ? '🟢 ATTIVATA' : '🔴 DISATTIVATA'}`,
        footer: `Clicca per ${isEnable ? 'disattivare' : 'attivare'}`,
        ...toggleButton
    }, { quoted: m });
}

handler.help = ['enable', 'disable'].map(v => v + ' <feature>');
handler.tags = ['owner', 'group'];
handler.command = /^((attiva|disabilita)|(turn)?[01])$/i;

export default handler;