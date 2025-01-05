// Función para obtener el saludo basado en la hora del día
function obtenerSaludo() {
  const horaActual = new Date().getHours();
  if (horaActual >= 6 && horaActual < 12) return '¡Buenos días! 🌞';
  if (horaActual >= 12 && horaActual < 18) return '¡Buenas tardes! 🌤️';
  return '¡Buenas noches! 🌙';
}

// Función para saludar a un usuario cuando se conecta a un canal por primera vez
async function saludoDeTiempo(channel, user) {
  const saludo = obtenerSaludo();
  try {
    const mensaje = await channel.send(`👋 ${saludo} ¡Hola, ${user.username}! Bienvenido al canal **${channel.name}**.`);
    setTimeout(() => mensaje.delete().catch(console.error), 10000); // Eliminar después de 10 segundos
  } catch (error) {
    console.error("Error al enviar el saludo de tiempo: ", error);
  }
}

// Función para enviar un saludo al entrar a cualquier canal de voz
async function saludoDeCanal(channel, user) {
  try {
    const mensaje = await channel.send(`👋 ¡Hola, ${user.username}! Bienvenido al canal **${channel.name}**.`);
    setTimeout(() => mensaje.delete().catch(console.error), 10000); // Eliminar después de 10 segundos
  } catch (error) {
    console.error("Error al saludar al entrar al canal: ", error);
  }
}

// Función para despedir al usuario cuando se desconecta
async function despedidaDeMiembro(channel, user) {
  try {
    const mensaje = await channel.send(`👋 ¡Adiós, ${user.username}! ¡Te extrañaremos en **${channel.guild.name}**!`);
    setTimeout(() => mensaje.delete().catch(console.error), 10000); // Eliminar después de 10 segundos
  } catch (error) {
    console.error("Error al enviar la despedida: ", error);
  }
}

// Inicialización y gestión de eventos
function EventoSaludo(client) {
  const saludosRealizados = new Set();

  // Evento cuando un miembro entra al servidor
  client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel;
    if (channel) await saludoDeTiempo(channel, member.user); // Saludo de la hora (mañana/tarde/noche)
  });

  // Evento cuando un miembro deja el servidor
  client.on('guildMemberRemove', async (member) => {
    const channel = member.guild.systemChannel;
    if (channel) await despedidaDeMiembro(channel, member.user); // Despedida
  });

  // Evento cuando un miembro entra o cambia de canal de voz
  client.on('voiceStateUpdate', async (oldState, newState) => {
    const member = newState.member;
    const channel = newState.channel;

    if (channel && (newState.channel !== oldState.channel)) {
      // Si el saludo de la hora aún no se ha enviado, lo enviamos
      if (!saludosRealizados.has(member.id)) {
        await saludoDeTiempo(channel, member.user);
        saludosRealizados.add(member.id);
      } else {
        await saludoDeCanal(channel, member.user); // Saludo al cambiar de canal
      }
    }

    // Si el miembro se desconecta, enviar la despedida
    if (!newState.channel && oldState.channel) {
      saludosRealizados.delete(member.id);
      await despedidaDeMiembro(oldState.channel, member.user);
    }
  });
}

module.exports = { EventoSaludo, saludoDeTiempo, saludoDeCanal, despedidaDeMiembro };
