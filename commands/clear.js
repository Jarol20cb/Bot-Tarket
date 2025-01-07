const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear-messages')
    .setDescription('Elimina una cantidad específica de mensajes recientes.')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Cantidad de mensajes a eliminar')
        .setRequired(true)
        .setMinValue(1) // Asegura que el número sea positivo
    ),

  async execute(interaction) {
    const cantidad = interaction.options.getInteger('cantidad');

    // Verificar si el usuario tiene permisos para eliminar mensajes
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({
        content: '¡No tienes permisos suficientes para eliminar mensajes!',
        ephemeral: true,
      });
    }

    // Intentar eliminar los mensajes
    try {
      // Fetch la cantidad de mensajes solicitada + 1 (para excluir el del comando)
      const messages = await interaction.channel.messages.fetch({ limit: cantidad + 1 });

      // Filtrar el mensaje del comando (interacción) para no eliminarlo
      const filteredMessages = messages.filter(msg => msg.id !== interaction.id);

      // Verificar si hay suficientes mensajes para eliminar
      if (filteredMessages.size < cantidad) {
        return interaction.reply({
          content: `Se intentaron eliminar **${cantidad}** mensajes, pero solo se pudieron eliminar **${filteredMessages.size}** debido a su antigüedad o otros factores.`,
          ephemeral: true,
        });
      }

      // Eliminar los mensajes, asegurando que no haya más de lo solicitado
      const deletedMessages = await interaction.channel.bulkDelete(filteredMessages.first(cantidad), true);

      // Responder con la cantidad exacta de mensajes eliminados
      await interaction.reply({
        content: `Se han eliminado **${deletedMessages.size}** mensajes correctamente.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Hubo un error al intentar eliminar los mensajes.',
        ephemeral: true,
      });
    }
  },
};
