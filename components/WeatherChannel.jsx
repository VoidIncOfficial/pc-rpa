const { React } = require('powercord/webpack');
const { Text } = require('powercord/components');

class WeatherChannel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.weather = props.weather;
        this.image = props.image;
    }

    render() {
        return (
            <div
                className='rpa-weather-channel'
            >
                <Text className='rpa-bold-label'>
                    Погода:
                </Text>
                <div className='rpa-weather-wrapper'>
                    <img className='rpa-weather-icon' src={this.image} />
                    <Text className='rpa-weather-label'>
                        {this.weather}
                    </Text>
                </div>
            </div>
        );
    }
}

module.exports = WeatherChannel;