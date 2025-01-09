const { format } = require('date-fns');

function registrarConexiones(client) {
  client.on('voiceStateUpdate', (oldState, newState) => {
    const member = newState.member;

    if (!oldState.channel && newState.channel) {
      const canal = newState.channel.name;
      const usuario = member.user.tag;
      const fechaHora = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      console.log(`📌 Usuario: ${usuario} | Canal: ${canal} | Fecha y Hora: ${fechaHora}`);
    }
  });
}

module.exports = {
  registrarConexiones,
};
