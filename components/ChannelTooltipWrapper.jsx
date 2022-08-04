const { React } = require('powercord/webpack');
const { Tooltip, Text, FormTitle } = require('powercord/components');

/*
<VoiceUserSummaryItem
    className="powercord-who-reacted-reactors"
    max='3'
    users={this.state.activeUsers}
/>
*/

class ChannelTooltipWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.channelElement = props.channelElement;
        this.arguments = props.arguments;
        this.state = {
            channelConfig: props.channelConfig,
            activeUsers: props.activeUsers
        }
    }
 
    renderTooltipBody() {
        var activeUsers = [];
        activeUsers.push(<div className='rpa-tooltip-alt-header'>Здесь находятся</div>);
        if (this.state.activeUsers)
            this.state.activeUsers.forEach(user => {
                if (!user) return;
                if (user.roleplayUser)
                    activeUsers.push(<div className='rpa-tooltip-here-user'>{user.roleplayUser.short ? user.roleplayUser.short : user.roleplayUser.name} {user.roleplayUser.short && <a style={{ color: 'rgb(120, 120, 120)' }}>({user.roleplayUser.name})</a>}</div>);
                else
                    activeUsers.push(<div className='rpa-tooltip-here-user'>{user.username}</div>);
            });
        if (activeUsers.length == 1) {
            activeUsers.push(<div className='rpa-tooltip-here-user'>Никого нет...</div>);
        }
        return (
            <div className='rpa-tooltip-content'>
                {this.state.channelConfig.image &&
                    <img
                        className='rpa-tooltip-banner'
                        src={this.state.channelConfig.image}
                    />
                }
                <FormTitle
                    className='rpa-tooltip-header'
                >
                    {this.state.channelConfig.name}
                </FormTitle>
                <Text
                    className='rpa-tooltip-location'
                >
                    {this.state.channelConfig.city}
                    {this.state.channelConfig.locationStack &&
                        <a
                            className='rpa-tooltip-locationstack'
                        >
                            {this.state.channelConfig.locationStack.join(' > ')}
                        </a>
                    }
                </Text>
                <hr className='rpa-tooltip-hr'></hr>
                {this.state.channelConfig.description && <div className='rpa-tooltip-alt-header'>Описание</div>}
                {this.state.channelConfig.description && <a className='rpa-tooltip-description'> {this.state.channelConfig.description} </a>}
                {this.state.channelConfig.description && <hr className='rpa-tooltip-hr'></hr>}
                <Text
                    className='rpa-tooltip-users-header'
                >
                    {activeUsers}
                </Text>
            </div>
        );
    }

    render() {
        return (
            <Tooltip
                className='rpa-tooltip'
                text={this.renderTooltipBody()}
            >
                {this.channelElement}
            </Tooltip>
        );
    }
}

module.exports = ChannelTooltipWrapper;