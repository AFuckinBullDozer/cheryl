const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require("../config/color.json");

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The 'lock' command is loaded.");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel.'),
    execute: async (interaction) => {
        if (interaction.member.permissions.has("MANAGE_MESSAGES")) {
            if (interaction.guild.me.permissions.has("MANAGE_CHANNELS")) {

                await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, { SEND_MESSAGES: false })

                const lockdownSuccess = new MessageEmbed()
                    .setDescription("The channel has been successfully lock.")
                    .setColor(Color.Green)

                return interaction.reply({ embeds: [lockdownSuccess] });
            } else {
                return interaction.reply({
                    content: "You cannot execute this command! You need the following permission ```MANAGE_MESSAGES``.",
                    ephemeral: true
                });
            };
        };
    }
};