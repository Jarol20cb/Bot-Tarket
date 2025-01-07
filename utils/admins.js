const { AttachmentBuilder } = require('discord.js');
const path = require('path');

// Función para saludar a un administrador o moderador
async function saludoDeAdministrador(client) {
  client.on('voiceStateUpdate', async (oldState, newState) => {
    const member = newState.member;

    if (member) {
      // Verifica si el miembro tiene el rol de 'Administrador' o 'Moderador'
      if (member.roles.cache.some(role => role.name === 'Administrador') || member.roles.cache.some(role => role.name === 'Moderador')) {
        const channel = newState.channel;

        if (channel) {
          try {
            // Ruta de la imagen de saludo
            const imagenPath = path.join(__dirname, '../img/saludo.png');

            // Crear el mensaje con la imagen y el texto sin diseño
            const mensaje = await channel.send({
              content: `¡Atención! Ha llegado **${member.user.username}**, uno de los **administradores**.`,
              files: [new AttachmentBuilder(imagenPath, { name: 'saludo.png' })],
            });

            // Eliminar el mensaje después de 10 segundos
            setTimeout(() => mensaje.delete().catch(console.error), 10000);
          } catch (error) {
            console.error("Error al saludar al administrador: ", error);
          }
        }
      }
    }
  });
}

module.exports = {
  saludoDeAdministrador,
};
