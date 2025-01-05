const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bringmember')
    .setDescription('Trae a un miembro de otro canal de voz al canal donde estás.')
    .addUserOption(option => option.setName('miembro').setDescription('El miembro que deseas traer').setRequired(true)),

  async execute(interaction) {
    const rolesPermisos = ['Administrador', 'Moderador'];
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

    const miembro = interaction.options.getUser('miembro');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const noChannelMsg = await interaction.reply({
        content: '¡Debes estar en un canal de voz para usar este comando!',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => noChannelMsg.delete(), 10000);
      return;
    }

    const member = interaction.guild.members.cache.get(miembro.id);
    if (!member.voice.channel) {
      const notInVoiceMsg = await interaction.reply({
        content: 'Este miembro no está en un canal de voz.',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => notInVoiceMsg.delete(), 10000);
      return;
    }

    try {
      await member.voice.setChannel(voiceChannel);
      const successMsg = await interaction.reply({
        content: `¡El miembro ${miembro.username} ha sido movido a tu canal de voz **${voiceChannel.name}**!`,
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => successMsg.delete(), 10000);
    } catch (error) {
      console.error(error);
      const errorMsg = await interaction.reply({
        content: 'Hubo un error al intentar mover al miembro.',
        fetchReply: true // Esto nos permite obtener el mensaje para eliminarlo más tarde
      });
      setTimeout(() => errorMsg.delete(), 10000);
    }
  },
};
