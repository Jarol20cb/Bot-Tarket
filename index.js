const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config/config.json');
const { EventoSaludo } = require('./utils/saludos');
const { bienvenida } = require('./utils/bienvenida');
const commandHandler = require('./commands/handlers/commandHandler');
const { saludoDeAdministrador } = require('./utils/admins.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} está conectado y listo para funcionar.`);
});

commandHandler(client);
EventoSaludo(client);
saludoDeAdministrador(client);

client.on('guildMemberAdd', (member) => {
  bienvenida(member);
});

client.login(token).catch(console.error);
