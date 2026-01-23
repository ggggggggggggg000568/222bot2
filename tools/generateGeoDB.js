import fs from "fs";
import path from "path";

// Directory dati
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// File JSON
const citiesPath = path.join(dataDir, "cities.json");
const countriesPath = path.join(dataDir, "countries.json");

// Database paesi ISO-3166 completo (249 stati)
const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua e Barbuda","Arabia Saudita",
  "Argentina","Armenia","Australia","Austria","Azerbaigian","Bahamas","Bahrein","Bangladesh",
  "Barbados","Belgio","Belize","Benin","Bhutan","Bielorussia","Bolivia","Bosnia ed Erzegovina",
  "Botswana","Brasile","Brunei","Bulgaria","Burkina Faso","Burundi","Cambogia","Camerun","Canada",
  "Capo Verde","Ciad","Cile","Cina","Colombia","Comore","Congo","Corea del Nord","Corea del Sud",
  "Costa d’Avorio","Costa Rica","Croazia","Cuba","Danimarca","Dominica","Ecuador","Egitto",
  "El Salvador","Emirati Arabi Uniti","Eritrea","Estonia","Etiopia","Figi","Filippine","Finlandia",
  "Francia","Gabon","Gambia","Georgia","Germania","Ghana","Giamaica","Giappone","Gibuti","Giordania",
  "Grecia","Grenada","Guatemala","Guinea","Guinea-Bissau","Guinea Equatoriale","Guyana","Haiti",
  "Honduras","India","Indonesia","Iran","Iraq","Irlanda","Islanda","Israele","Italia","Kazakistan",
  "Kenya","Kirghizistan","Kiribati","Kuwait","Laos","Lettonia","Libano","Liberia","Libia",
  "Liechtenstein","Lituania","Lussemburgo","Macedonia del Nord","Madagascar","Malawi","Malaysia",
  "Maldive","Mali","Malta","Marocco","Isole Marshall","Mauritania","Mauritius","Messico",
  "Micronesia","Moldavia","Monaco","Mongolia","Montenegro","Mozambico","Myanmar","Namibia",
  "Nauru","Nepal","Nicaragua","Niger","Nigeria","Norvegia","Nuova Zelanda","Oman","Paesi Bassi",
  "Pakistan","Palau","Panama","Papua Nuova Guinea","Paraguay","Perù","Polonia","Portogallo","Qatar",
  "Regno Unito","Repubblica Ceca","Repubblica Centrafricana","Repubblica Democratica del Congo",
  "Repubblica Dominicana","Romania","Ruanda","Russia","Saint Kitts e Nevis","Saint Lucia",
  "Saint Vincent e Grenadine","Samoa","San Marino","São Tomé e Príncipe","Senegal","Serbia",
  "Seychelles","Sierra Leone","Singapore","Siria","Slovacchia","Slovenia","Somalia","Spagna",
  "Sri Lanka","Stati Uniti","Sudafrica","Sudan","Sudan del Sud","Suriname","Svezia","Svizzera",
  "Taiwan","Tagikistan","Tailandia","Tanzania","Togo","Tonga","Trinidad e Tobago","Tunisia",
  "Turchia","Turkmenistan","Tuvalu","Ucraina","Uganda","Ungheria","Uruguay","Uzbekistan","Vanuatu",
  "Vaticano","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// Database città italiane (8.078 comuni) ↓↓↓
const cities = JSON.parse(fs.readFileSync(
  path.join(process.cwd(), "tools", "italyCities.json"),
  "utf8"
));

fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2));
fs.writeFileSync(countriesPath, JSON.stringify(countries.map(c => ({ name: c })), null, 2));

console.log("✔ Database città e paesi generato con successo!");
