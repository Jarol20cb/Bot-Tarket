const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disconnectall')
    .setDescription('Desconecta a todos los miembros del canal de voz.'),

  async execute(interaction) {
    const rolesPermisos = ['Administrador', 'Moderador']; // Asegúrate de que estos roles existan en tu servidor
    const userRoles = interaction.member.roles.cache.map(role => role.name);
    const tienePermiso = rolesPermisos.some(role => userRoles.includes(role));

    if (!tienePermiso) {
      const noPermisoMsg = await interaction.reply({
        content: '¡No tienes permisos para usar este comando!',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => noPermisoMsg.delete(), 10000);
      return;
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      const noChannelMsg = await interaction.reply({
        content: '¡Debes estar en un canal de voz para usar este comando!',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => noChannelMsg.delete(), 10000);
      return;
    }

    try {
      // Desconectar a todos los miembros del canal de voz, incluyendo al que ejecuta el comando
      voiceChannel.members.forEach(member => {
        member.voice.disconnect(); // Desconectar a todos, incluido el ejecutante
      });

      const message = await interaction.reply({
        content: `¡Se han desconectado todos los miembros del canal de voz **${voiceChannel.name}**!`,
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });

      // Eliminar el mensaje después de 10 segundos
      setTimeout(() => message.delete(), 10000); 
    } catch (error) {
      console.error(error);
      const errorMsg = await interaction.reply({
        content: 'Hubo un error al intentar desconectar a los miembros.',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => errorMsg.delete(), 10000);
    }
  },
};
