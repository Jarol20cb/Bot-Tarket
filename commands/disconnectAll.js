const { SlashCommandBuilder } = require('@discordjs/builders');
const rolesConfig = require('../config/rolesConfig'); // Importa el archivo de roles

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desconectar-todos')
        .setDescription('Desconecta a todos los usuarios de los canales de voz.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const member = interaction.member;
            // Verifica si el miembro tiene el rol de 'Admin' o 'Moderador' desde rolesConfig
            const rolesPermisos = [rolesConfig.rol_1, rolesConfig.rol_2]; // Puedes agregar más roles aquí
            const userRoles = member.roles.cache.map(role => role.name);
            const tienePermiso = rolesPermisos.some(role => userRoles.includes(role));

            if (!tienePermiso) {
                return interaction.editReply({
                    content: '🚫 **Acción Denegada**: No tienes permisos para usar este comando.',
                    embeds: [],
                });
            }

            const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2);
            let usersDisconnected = 0;

            for (const [, channel] of voiceChannels) {
                for (const [, member] of channel.members) {
                    await member.voice.disconnect().catch(console.error);
                    usersDisconnected++;
                }
            }

            const embedMessage = {
                color: 0x1abc9c, // Verde claro para éxito
                title: '**Desconexión Exitosa**',
                description: `El administrador **${interaction.user.username}** ha desconectado **${usersDisconnected}** usuario(s).`,
                fields: [
                    {
                        name: 'Usuarios Desconectados',
                        value: `**${usersDisconnected}**`,
                        inline: true,
                    },
                ],
                footer: {
                    text: 'Tarket Bot | Gestión',
                },
                timestamp: new Date(),
            };

            await interaction.editReply({ content: '✅ **Comando ejecutado correctamente**:', embeds: [embedMessage] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: '❌ **Error**: Hubo un problema al ejecutar el comando.',
                embeds: [],
            });
        }
    }
};
