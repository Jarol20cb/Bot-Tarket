const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const rolesConfig = require('../config/rolesConfig'); // Importa el archivo de roles

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message-admins')
        .setDescription('Envía un mensaje al canal de administradores.')
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('El mensaje que quieres enviar a los administradores.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            // Usa rolesPermisos desde el archivo de rolesConfig
            const rolesPermisos = rolesConfig.rol_1; // Asegúrate de usar el rol correcto desde rolesConfig
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

            await interaction.reply({ content: 'Mensaje enviado.', flags: 64 });

            const mensaje = interaction.options.getString('mensaje');
            const autor = interaction.user;

            const adminChannelId = '1326598116165685259'; // Cambia esto por el ID del canal
            const adminChannel = interaction.client.channels.cache.get(adminChannelId);

            if (!adminChannel) {
                return interaction.editReply('No se pudo encontrar el canal de administradores. Verifica el ID.');
            }

            const embed = new EmbedBuilder()
                .setColor('#FFA500') // Color resaltado
                .setTitle('📢 Nuevo mensaje')
                .setDescription(`"${mensaje}"`)
                .setFooter({
                    text: `Enviado por ${autor.tag} (${autor.id}) el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`,
                    iconURL: autor.displayAvatarURL({ dynamic: true })
                });

            await adminChannel.send({ embeds: [embed] });
            await interaction.editReply('Tu mensaje fue enviado correctamente a los administradores.');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            if (!interaction.replied) {
                await interaction.reply('Hubo un error al intentar enviar el mensaje.');
            } else {
                await interaction.followUp('Hubo un error al procesar tu solicitud.');
            }
        }
    },
};
