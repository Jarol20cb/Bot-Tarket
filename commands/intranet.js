const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('intranet')
    .setDescription('Envía un mensaje con un botón para acceder a la intranet'),

  async execute(interaction) {
    const enlace = 'https://tarket.site'; // Cambia esto por el enlace deseado

    // Obtener el logo del servidor
    const serverIconUrl = interaction.guild.iconURL() || 'https://default-url.com/default-logo.png'; // URL del logo del servidor

    // Crear un embed con un diseño profesional y atractivo
    const embed = new EmbedBuilder()
      .setTitle('🔑 Acceso Exclusivo a la Intranet')
      .setDescription('¡Bienvenido! Haz clic en el botón de abajo para acceder a nuestra intranet.')
      .setColor('#00A4CC') // Color azul más brillante
      .setThumbnail(serverIconUrl) // Usar el logo del servidor
      .setFooter({ text: 'Tarket - Soluciones PYME', iconURL: serverIconUrl }) // Usar el logo del servidor en el pie de página
      .setTimestamp();

    // Crear un botón con estilo atractivo
    const boton = new ButtonBuilder()
      .setLabel('Ir a la Intranet')
      .setStyle(ButtonStyle.Link)
      .setURL(enlace);

    // Crear una fila de acción para incluir el botón
    const fila = new ActionRowBuilder().addComponents(boton);

    // Enviar el mensaje al canal donde se ejecutó el comando
    await interaction.reply({
      embeds: [embed],
      components: [fila],
      ephemeral: false, // Mostrar el mensaje a todos en el canal
    });
  },
};
