const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información básica sobre este servidor.'),

  async execute(interaction) {
    const guild = interaction.guild;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status === 'online').size;

    const embed = new EmbedBuilder()
      .setTitle('Información del Servidor')
      .setColor('#1E90FF')
      .setThumbnail(guild.iconURL())
      .setDescription(`Este servidor está gestionado por **Tarket**, una empresa de digitalización para pequeñas y medianas empresas (PYMEs). Nos especializamos en la creación de páginas web, marketing digital y soluciones personalizadas para cada negocio. 🌐💡`)
      .addFields(
        { name: 'Nombre del servidor', value: guild.name, inline: true },
        { name: 'ID del servidor', value: guild.id, inline: true },
        { name: 'Miembros totales', value: `${guild.memberCount}`, inline: true },
        { name: 'Fecha de creación', value: guild.createdAt.toDateString(), inline: false },
        { name: 'Propietario', value: `<@${guild.ownerId}>`, inline: false },
        { name: 'Región', value: guild.preferredLocale, inline: false },
      )
      .setFooter({ text: 'Tarket - Digitalización de PYMEs' })
      .setTimestamp();
      
    await interaction.reply({
      embeds: [embed],
    });
  },
};
