const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the member')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.editReply({ content: 'You do not have permission to kick members.', ephemeral: true });
        }

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) {
            return interaction.editReply({ content: 'Member not found.', ephemeral: true });
        }

        try {
            await target.kick(reason);
            const embed = new EmbedBuilder()
                .setColor('#DFC5FE')
                .setTitle('<:KickRocks:1317756634952499221> Member Kicked')
                .setDescription(`${target.user.tag} has been kicked.\nReason: ${reason}`)
                .setTimestamp();
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `Failed to kick: ${error.message}`, ephemeral: true });
        }
    },
};
