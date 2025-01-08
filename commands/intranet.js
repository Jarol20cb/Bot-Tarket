const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('messageall')
        .setDescription('Envía un mensaje a los chats asociados a los canales de voz.')
        .addStringOption(option =>
            option.setName('mensaje')
                .setDescription('El mensaje que quieres enviar.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.reply({ content: 'Comenzando a enviar mensajes...', ephemeral: true });

            const mensaje = interaction.options.getString('mensaje');
            const guild = interaction.guild;

            if (!guild) {
                return interaction.editReply('Este comando solo funciona en servidores.');
            }

            // Mostrar todos los canales y su tipo
            console.log('Todos los canales disponibles:');
            guild.channels.cache.forEach(canal => {
                console.log(`Canal: ${canal.name}, Tipo: ${canal.type}`);
            });

            const canales = guild.channels.cache;
            const canalesDeVoz = [];
            const canalesDeTexto = [];

            // Clasificar los canales y ver los tipos
            canales.forEach(canal => {
                if (canal.type === 'GUILD_VOICE') {
                    canalesDeVoz.push(canal);
                } else if (canal.type === 'GUILD_TEXT') {
                    canalesDeTexto.push(canal);
                }
            });

            if (canalesDeVoz.length > 0) {
                console.log('Canales de voz encontrados:');
                canalesDeVoz.forEach(canal => console.log(`Canal de voz: ${canal.name}`));
            } else {
                console.log('No se encontraron canales de voz.');
            }

            if (canalesDeTexto.length > 0) {
                console.log('Canales de texto encontrados:');
                canalesDeTexto.forEach(canal => console.log(`Canal de texto: ${canal.name}`));
            } else {
                console.log('No se encontraron canales de texto.');
            }

            if (canalesDeVoz.length === 0) {
                await interaction.editReply('No se encontraron canales de voz.');
                return;
            }

            if (canalesDeTexto.length === 0) {
                await interaction.editReply('No se encontraron canales de texto.');
                return;
            }

            let enviados = 0;

            // Enviar mensaje a los canales de texto correspondientes
            for (const canalVoz of canalesDeVoz) {
                const canalTexto = canalesDeTexto.find(c => c.name === canalVoz.name);
                if (canalTexto) {
                    try {
                        await canalTexto.send(`Mensaje desde el canal de voz **${canalVoz.name}**: ${mensaje}`);
                        enviados++;
                    } catch (error) {
                        console.error(`Error al enviar mensaje al canal de texto ${canalTexto.name}:`, error);
                    }
                } else {
                    console.log(`No se encontró canal de texto para el canal de voz: ${canalVoz.name}`);
                }
            }

            if (enviados > 0) {
                await interaction.editReply(`Se enviaron mensajes a los chats de ${enviados} canales de voz.`);
            } else {
                await interaction.editReply('No se encontraron canales de texto asociados a los canales de voz.');
            }

        } catch (error) {
            console.error('Error en la ejecución del comando:', error);
            if (!interaction.replied) {
                await interaction.reply('Hubo un error al ejecutar el comando.');
            } else {
                await interaction.followUp('Hubo un error al intentar enviar el mensaje.');
            }
        }
    },
};
