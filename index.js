const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config/config.js');
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

// Función para formatear el mensaje de inicio con un diseño bonito
function logBotStartup() {
  const botName = client.user.tag;
  const message = `${botName} ha sido conectado exitosamente.`;
  const borderLength = message.length + 4;
  const border = '═'.repeat(borderLength);

  console.log(`╔${border}╗`);
  console.log(`║  ${message}  ║`);
  console.log(`╚${border}╝`);
}

client.once('ready', () => {
  logBotStartup();
});

commandHandler(client);
EventoSaludo(client);
saludoDeAdministrador(client);

client.on('guildMemberAdd', (member) => {
  bienvenida(member);
});

client.login(token).catch(console.error);
