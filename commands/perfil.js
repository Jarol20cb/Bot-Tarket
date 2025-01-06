const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generar-perfil')
    .setDescription('Genera una imagen de perfil personalizada.'),
  async execute(interaction) {
    try {
      // Deferimos la respuesta para indicar que el bot está trabajando
      await interaction.deferReply();

      // Cargar la imagen base
      const baseImagePath = path.join(__dirname, '../img/Perfil.png');
      const baseImage = await loadImage(baseImagePath);

      // Cargar el avatar del usuario
      const avatarURL = interaction.user.displayAvatarURL({ extension: 'png', size: 256 });
      const avatarImage = await loadImage(avatarURL);

      // Crear el canvas
      const canvas = createCanvas(500, 500);
      const ctx = canvas.getContext('2d');

      // Dibujar la imagen base
      ctx.drawImage(baseImage, 0, 0, 500, 500);

      // Personalización del tamaño y posición del avatar
      const radius = 135; // Tamaño del avatar
      const offsetX = 2; // Desplazamiento horizontal (positivo para la derecha, negativo para la izquierda)
      const offsetY = 7; // Desplazamiento vertical (positivo hacia abajo, negativo hacia arriba)

      const centerX = canvas.width / 2 + offsetX;
      const centerY = canvas.height / 2 + offsetY;

      // Dibujar el avatar en un círculo
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatarImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Crear el archivo adjunto
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'perfil-generado.png' });

      // Editar la respuesta original con la imagen generada
      await interaction.editReply({ content: '¡Aquí está tu imagen de perfil personalizada!', files: [attachment] });
    } catch (error) {
      console.error('Error generando la imagen:', error);
      // Responder con un mensaje de error
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: 'Hubo un error generando tu imagen de perfil. Por favor, intenta más tarde.' });
      } else {
        await interaction.reply({ content: 'Hubo un error generando tu imagen de perfil. Por favor, intenta más tarde.', ephemeral: true });
      }
    }
  },
};
