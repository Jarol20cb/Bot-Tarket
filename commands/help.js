const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help-commands')
    .setDescription('Muestra todos los comandos disponibles en el servidor.'),

  async execute(interaction) {
    // Definir los comandos
    const commands = [
      { name: '/help-commands', description: 'Muestra todos los comandos disponibles en el servidor.' },
      { name: '/intranet', description: 'Muestra un mensaje con un botón para acceder a la intranet de la empresa.' },
      { name: '/serverinfo', description: 'Muestra información básica sobre este servidor.' },
      { name: '/desconectar-todos', description: 'Desconecta a todos los miembros de todos los canales de voz.' },
      { name: '/mover-miembro', description: 'Mueve a un usuario específico a otro canal de voz.' },
      { name: '/clear-messages', description: 'Elimina una cantidad específica de mensajes recientes del canal.' },
      { name: '/generar-perfil', description: 'Genera una imagen de perfil personalizada.' },
    ];

    // Crear un embed con la lista de comandos
    const embed = new EmbedBuilder()
      .setTitle('Comandos disponibles')
      .setDescription('Aquí tienes una lista de los comandos que puedes usar:')
      .setColor('#007BFF') // Azul profesional
      .addFields(commands.map(command => ({
        name: command.name,
        value: command.description,
      })))
      .setFooter({ text: 'Tarket - Soluciones PYME' })
      .setTimestamp();

    // Enviar el embed al canal
    await interaction.reply({
      embeds: [embed],
    });
  },
};
