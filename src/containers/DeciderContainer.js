import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Decider from '../components/Decider';

class DeciderContainer extends Component {
    getUserId = async () => {
        const res = await this.props.spotifyApi.getMe();
        return res.body.id;
    };

    getTrackFeatures = async () => {
        const {spotifyApi, track} = this.props;
        const res = await spotifyApi.getAudioFeaturesForTrack(track.id);
        return res.body;
    };

    isItBangin = (trackFeatures) => {
        console.log(trackFeatures.danceability, trackFeatures.energy, (trackFeatures.danceability + trackFeatures.energy) / 2)
        return (trackFeatures.danceability &&
            trackFeatures.energy &&
            trackFeatures.danceability >= 0.4 &&
            trackFeatures.energy >= 0.4 &&
            (trackFeatures.danceability + trackFeatures.energy) / 2 >= 0.6);
    }

    decide = async () => {
        const {showNotification, onSuccess} = this.props;

        // showNotification('Deciding...');
        // const userId = await this.getUserId();
        const trackFeatures = await this.getTrackFeatures();
        console.log(trackFeatures);
        const isBanger = this.isItBangin(trackFeatures);
        console.log("Banger? : " + isBanger);
        if (isBanger) {
            alert("It's an absolute BANGER!");
        } else {
            alert("Not a banger mate");
        }
        // showNotification('Done.', null, null);
        onSuccess();
    };

    render() {
        return (
            <Decider enabled={!!this.props.track} onClick={this.decide}/>
        )
    }
}

DeciderContainer.propTypes = {
    spotifyApi: PropTypes.object.isRequired,
    track: PropTypes.object,
    showNotification: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default DeciderContainer;
