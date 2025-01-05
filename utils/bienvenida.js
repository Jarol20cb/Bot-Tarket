const { EmbedBuilder } = require('discord.js');

// Función para generar un color hexadecimal aleatorio
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  bienvenida: async (member) => {
    try {
      const bienvenidaChannel = member.guild.channels.cache.find(channel => channel.name === 'bienvenida');

      if (!bienvenidaChannel) {
        console.error('No se encontró el canal de bienvenida.');
        return;
      }

      const serverName = member.guild.name;
      const memberCount = member.guild.memberCount;

      const embed = new EmbedBuilder()
        .setColor(getRandomColor()) // Color aleatorio para cada mensaje
        .setTitle('¡Bienvenido a Tarket! 🎉')
        .setDescription(`¡Hola **${member.user.username}**! Eres el **#${memberCount}** en nuestro servidor **${serverName}**.\n¡Nos alegra tenerte con nosotros!`)
        .setThumbnail(member.user.avatarURL()) // Foto de perfil más grande
        .setFooter({ text: `¡Disfruta tu tiempo en Tarket!`, iconURL: member.guild.iconURL() }) // Icono del servidor
        .setTimestamp();

      // Enviar el mensaje al canal de bienvenida
      await bienvenidaChannel.send({ embeds: [embed] });

    } catch (error) {
      console.error('Hubo un error al enviar el mensaje de bienvenida:', error);
    }
  }
};
