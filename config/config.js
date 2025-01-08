require('dotenv').config();

console.log('Token cargado exitosamente');

module.exports = {
  token: process.env.TOKEN,
  guildId: process.env.GUILD_ID,
  clientId: process.env.CLIENT_ID,
};

