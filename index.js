/** @type {import('../../../fake_node_modules/powercord/entities/').default} */

const { Plugin } = require('powercord/entities');
const { getModule, React, FluxDispatcher } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');

const ChannelTooltipWrapper = require('./components/ChannelTooltipWrapper');
const UserTooltipWrapper = require('./components/UserTooltipWrapper');
const WeatherChannel = require('./components/WeatherChannel');

const scfg = require('./_scfg.json');

module.exports = class RpA extends Plugin { 
    startPlugin() {
        this.userBindings = {};

        this.loadStylesheet('style.css');
        this.patchChannelItem();
        // this.patchMessageUsername();
        this.startWatching();
    }

    pluginWillUnload() {
        uninject('rpa-user-location');
        // uninject('rpa-message-user');
        FluxDispatcher.unsubscribe('MESSAGE_CREATE');
    }

    startWatching() {
        FluxDispatcher.subscribe('MESSAGE_CREATE', ({ message }) => {
            if (scfg.channels.find(cfg => cfg.id == message.channel_id) && scfg.players.find(player => player.id == message.author.id) && !(message.content.trim().startsWith('/') || message.content.trim().startsWith('(')))
                this.userBindings[message.author.id] = {
                    user: message.author,
                    channel: message.channel_id
                };
        });
    }

    async patchMessageUsername() {
        const MessageHeader = await getModule(m => m.default && m.default.displayName === 'MessageHeader');

        inject('rpa-message-user', MessageHeader, 'default', (args, res) => {
            res.props.username = React.createElement(UserTooltipWrapper, {
                mana: 1,
                maxMana: 1,
                userHeader: res.props.username
            });

			return res;
		});
    }

    async patchChannelItem() {
        const ConnectedVoiceChannel = await getModule(m => m.default && m.default.displayName === 'ChannelItem');

        const renderTooltip = (channel, res) => {
            var channelConfig = scfg.channels.find(cfg => cfg.id == channel.id);

            if (channel.isGuildVoice()) return null;
            if (channel.isGuildStageVoice()) return null;
            if (!channelConfig) return null;

            var users = [];
            Object.values(this.userBindings).forEach(userData => {
                if (userData.channel == channel.id)
                    users.push({
                        username: userData.user.username,
                        roleplayUser: scfg.players.find(player => player.id == userData.user.id)
                    });
            });
            
            const ChannelTooltip = React.createElement(ChannelTooltipWrapper, {
                channel,
                channelElement: res,
                activeUsers: users,
                channelConfig: channelConfig
            });

            return ChannelTooltip;
        };

        const renderWeather = (channel, res) => {
            var channelConfig = scfg.specialChannels.find(c => c.id == channel.id && c.type == 'weather');

            if (!channelConfig) return null;
            if (channel.isGuildVoice()) return null;
            if (channel.isGuildStageVoice()) return null;

            var weather = scfg.configuration.weather.find(w => channel.name.includes(w.legacyEmoji));

            if (!weather)
                return null;

            return React.createElement(WeatherChannel, {
                channel,
                weather: weather.name,
                image: weather.image
            });
        };

        const renderCount = (args, res) => {
            if (!Array.isArray(res)) res = [res];

            var channel = args[0].channel;
            
            var renderResult;

            if (renderResult = renderTooltip(channel, res))
                return renderResult;

            if (renderResult = renderWeather(channel, res))
                return renderResult;

            return res;
        };

        inject('rpa-user-location', ConnectedVoiceChannel, 'default', renderCount);

        ConnectedVoiceChannel.default.displayName = 'ChannelItem';
    }
}