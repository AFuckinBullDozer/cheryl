const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Color = require("../config/color.json");

const dateTime = new Date();
console.log(dateTime.toLocaleString() + " -> The 'unban' command is loaded.")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user.')
        .addUserOption(option => option.setName("user").setDescription("User to unban").setRequired(true)),
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

        if (interaction.member.permissions.has("BAN_MEMBERS")) {
            if (interaction.guild.me.permissions.has("BAN_MEMBERS")) {
                const user = interaction.options.getUser("user");
                const banList = await interaction.guild.bans.fetch();
                const bannedUser = banList.find(user => user.id === user.id);

                switch (user.id) {
                    case (!user):
                        return interaction.reply({
                            content: "I can't find this user!",
                            ephemeral: true
                        });
                    case (interaction.member.id):
                        return interaction.reply({
                            content: "You can't unban yourself!",
                            ephemeral: true
                        });
                    case (bot.user.id):
                        return interaction.reply({
                            content: "You can't unban me!",
                            ephemeral: true
                        });
                    default:
                        if (!bannedUser) {
                            return interaction.reply({
                                content: "You can't unban this user, since they are not banned!",
                                ephemeral: true,
                            });
                        } else {
                            const banMessage = new MessageEmbed()
                                .setDescription("``" + user.tag + "`` has been unban from the server.")
                                .setColor(Color.Green)

                            await interaction.reply({
                                embeds: [banMessage],
                                ephemeral: true,
                            });

                            if (LoggingData) {
                                if (LoggingData.ChannelIDUnban) {
                                    if (interaction.guild.members.guild.me.permissionsIn(LoggingData.ChannelIDUnban).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) {
                                        const logChannel = interaction.guild.channels.cache.get(LoggingData.ChannelIDUnban);

                                        const logMessage = new MessageEmbed()
                                            .setTitle("New Unban")
                                            .setDescription("__**User:**__ ``" + user.tag + "``\n__**Moderator:**__ ``" + interaction.user.tag + "``")
                                            .setFooter({
                                                text: "ID: " + user.id
                                            })
                                            .setTimestamp()
                                            .setColor(Color.Green)

                                        await logChannel.send({
                                            embeds: [logMessage],
                                        });
                                    }
                                }
                            }
                            return interaction.guild.members.unban(user.id);
                        }
                }
            } else {
                return interaction.reply({
                    content: "I need the following permissions: ``BAN_MEMBERS``.",
                    ephemeral: true,
                });
            };
        } else {
            return interaction.reply({
                content: "You cannot execute this command! You need the following permission ``BAN_MEMBERS``.",
                ephemeral: true
            })
        }
    }
};