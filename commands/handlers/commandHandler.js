const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, guildId, clientId } = require('../../config/config.js');

module.exports = async (client) => {
  client.commands = new Map();
  const commandsPath = path.join(__dirname, '../');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  const commands = [];
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (!client.commands.has(command.data.name)) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '9' }).setToken(token);

  try {
    console.log('Comenzando el registro de comandos...');
    // Registra los comandos solo para un servidor específico (útil para pruebas)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Comandos registrados correctamente');
  } catch (error) {
    console.error('Error al registrar los comandos:', error);
  }

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
    }
  });
};
