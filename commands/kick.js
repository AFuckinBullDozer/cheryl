const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require("../config/color.json");

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The 'kick' command is loaded.");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member!')
        .addUserOption(option => option.setName("user").setDescription("User to kick.").setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Enter the reason.')
            .setRequired(true)
        ),
    execute: async (interaction, bot, sequelize, Sequelize) => {
        const Logging = sequelize.define("Logging", {
            GuildID: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDReport: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDBan: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDVerify: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDEnterServer: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDWelcome: {
                type: Sequelize.STRING,
                unique: false,
            },
            StaffRoleReport: {
                type: Sequelize.STRING,
                unique: false,
            },
            StaffRoleVerify: {
                type: Sequelize.STRING,
                unique: false,
            },
            RoleToAddVerify: {
                type: Sequelize.STRING,
                unique: false,
            },
            RoleToRemoveVerify: {
                type: Sequelize.STRING,
                unique: false,
            },
            EnableDisableBlacklistLogger: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDBlacklist: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDWarn: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDUnban: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDKick: {
                type: Sequelize.STRING,
                unique: false,
            },
            ChannelIDReceiveVerification: {
                type: Sequelize.STRING,
                unique: false,
            },
            AutoBanStatus: {
                type: Sequelize.STRING,
                unique: false,
            }
        });
        const LoggingData = await Logging.findOne({ where: { GuildID: interaction.guild.id } });

        if (interaction.member.permissions.has("KICK_MEMBERS")) {
            if (interaction.guild.me.permissions.has("KICK_MEMBERS")) {
                const user = interaction.options.getUser("user")
                const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => { })
                let guild = bot.guilds.cache.get(interaction.guild.id);

                switch (member.id) {
                    case (!member):
                        return interaction.reply({
                            content: "I can't find this user!",
                            ephemeral: true
                        });
                    case (interaction.member.id):
                        return interaction.reply({
                            content: "You can't kick yourself!",
                            ephemeral: true
                        });
                    case (bot.user.id):
                        return interaction.reply({
                            content: "You can't kick me!",
                            ephemeral: true
                        });
                    case (!member.kickable):
                        return interaction.reply({
                            content: "I can't kick this user!",
                            ephemeral: true,
                        });
                    default:
                        if (guild.members.cache.find(m => m.id === user.id)?.id) {
                            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                                return interaction.reply({
                                    content: "You can't kick this user, because he's higher than you!",
                                    ephemeral: true
                                });
                            }
                        }

                        const reason = interaction.options.getString("reason");
                        const admin = interaction.user.tag;

                        const kickMessage = new MessageEmbed()
                            .setDescription("``" + member.user.tag + "`` has been kicked from the server for ``" + reason + "``.")
                            .setColor(Color.Green)

                        await interaction.reply({
                            embeds: [kickMessage],
                            ephemeral: true
                        })

                        if (LoggingData) {
                            if (LoggingData.ChannelIDKick) {
                                const logChannel = interaction.guild.channels.cache.get(LoggingData.ChannelIDKick)

                                const logMessage = new MessageEmbed()
                                    .setTitle("New Kick")
                                    .setDescription("**__User:__** ``" + member.user.tag + "``\n**__Reason:__** ``" + reason + "``\n**__Moderator:__** ``" + admin + "``")
                                    .setFooter({ text: "ID: " + member.id })
                                    .setTimestamp()
                                    .setColor(Color.RiskMedium)

                                await logChannel.send({ embeds: [logMessage] })
                            }
                        }
                        const kickDM = new MessageEmbed()
                            .setDescription("You have been kicked on ``" + interaction.guild.name + "`` for ``" + reason + "`` by ``" + admin + "``.")
                            .setColor(Color.RiskMedium)

                        await member.send({
                            embeds: [kickDM],
                        }).catch(() => { return });

                        return member.kick({ reason: [reason + " | " + admin] });
                }
            } else {
                return interaction.reply({
                    content: "I need the following permissions: ``KICK_MEMBERS``.",
                    ephemeral: true,
                });
            }
        } else {
            return interaction.reply({
                content: "You cannot execute this command! You need the following permission ``KICK_MEMBERS``.",
                ephemeral: true
            })
        }
    }
};