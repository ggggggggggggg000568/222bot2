// start.js
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
import cfonts from 'cfonts';

// 📁 Inizializzazione percorsi
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, './package.json'));
const rl = createInterface(process.stdin, process.stdout);

// 🖥️ Messaggi animati con cfonts
const animatedMessage = (text, font = 'block', colors = ['cyan', 'blue'], align = 'center') => {
  cfonts.say(text, {
    font,
    align,
    gradient: colors,
    transitionGradient: true,
  });
};

// 👑 Corona ASCII "Tech God"
const crown = `
               @@@
             @@@@@@@
          @@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@@@   @   @@@@@@@@@@@
 @@@@@@@@@@@     @     @@@@@@@@@@@
@@@@@@@@@@       @       @@@@@@@@@@
@@@@@@@@@   @@@@@@@@@@@   @@@@@@@@@
@@@@@@@@@   @@@@@@@@@@@   @@@@@@@@@
@@@@@@@@@   @@@@@@@@@@@   @@@@@@@@@
 @@@@@@@@@               @@@@@@@@@@
   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@
         @@@@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@
               @@@@@@@@
                 @@@
`;

// 🧼 Pulizia schermo e banner iniziale
console.clear();

// Stampa la corona in oro brillante
console.log(chalk.hex('#FFD700').bold(crown));

// Banner principale
animatedMessage('222 BOT', 'block', [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#8B00FF',
]);

// Scritta “222” in stile divino
animatedMessage('222', 'chrome', ['#FFD700', '#FF4500']);

// ▶️ Stato per evitare doppio avvio
let isRunning = false;

/**
 * Avvia il file specificato in cluster
 * @param {string} file - File da eseguire (es. main.js)
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];

  animatedMessage('prod by 222 TEAM', 'console', ['cyan', 'magenta']);

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  });

  let processInstance = fork();

  processInstance.on('message', (data) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[📩 ${timestamp}]`, data);

    switch (data) {
      case 'reset':
        console.log(chalk.yellowBright('🔄 Riavvio in corso...'));
        processInstance.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        processInstance.send(process.uptime());
        break;
    }
  });

  processInstance.on('exit', (_, code) => {
    isRunning = false;
    console.error(chalk.red('❌ Processo terminato con codice:'), code);

    if (code !== 0) {
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });

  // 📥 Input manuale da console
  const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
  if (!opts['test']) {
    if (!rl.listenerCount('line')) {
      rl.on('line', (line) => {
        processInstance.emit('message', line.trim());
      });
    }
  }
}

// 🟢 Avvia main.js (o il tuo file principale)
start('main.js');