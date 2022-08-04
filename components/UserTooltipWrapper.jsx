const { React } = require('powercord/webpack');
const { Tooltip, Text, FormTitle } = require('powercord/components');


class UserTooltipWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.mana = props.mana;
        this.maxMana = props.maxMana;
        this.userHeader = props.userHeader;
    }

    renderTooltipBody() {
        return (
            <div className='rpa-tooltip-user-content'>
                <b>Количество MP: </b> {this.mana}/{this.maxMana}
            </div>
        );
    }

    render() {
        return (
            <Tooltip
                className='rpa-tooltip-user'
                position='left'
                text={this.renderTooltipBody()}
            >
                {this.userHeader}
            </Tooltip>
        );
    }
}

module.exports = UserTooltipWrapper;