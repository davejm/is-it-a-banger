import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Typography } from 'material-ui';

class SelectedArtist extends Component {
    render() {
        const {name, image, ...others} = this.props;
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} {...others}>
                <img src={image} alt={name} style={{maxHeight: 600, marginBottom: 20}} />
                <Typography variant="title">Selected track: {name}</Typography>
            </div>
        );
    }
}

SelectedArtist.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string
};

export default SelectedArtist;
