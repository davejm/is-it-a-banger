import React, {Component} from 'react';
import TrackSearch from '../components/TrackSearch';
import PropTypes from "prop-types";

class TrackSearchContainer extends Component {
    state = {
        value: '',
        suggestions: [],
    };

    parseTrackSearchResponse(res) {
        return res.body.tracks.items.map((item) => {
            const imageHiRes = item.album.images.length > 0 ? item.album.images[0].url : null;
            const imageLowRes = item.album.images.length > 0 ? item.album.images[item.album.images.length - 1].url : null;
            return {
                name: item.name,
                imageLowRes,
                imageHiRes,
                id: item.id,
                uri: item.uri
            };
        });
    }

    searchTrack = async (query) => {
        const {spotifyApi} = this.props;
        try {
            const res = await spotifyApi.searchTracks(query, {limit: 6});
            console.log(res);
            return this.parseTrackSearchResponse(res);
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    handleSuggestionsFetchRequested = async ({ value }) => {
        this.setState({
            suggestions: await this.searchTrack(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
    };

    onSelect = (selection) => {
        this.setState({
            value: ''
        });
        this.props.onSelect(selection);
    };

    render() {
        return (
            <TrackSearch
                handleSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                handleSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                handleChange={this.handleChange}
                value={this.state.value}
                suggestions={this.state.suggestions}
                onSelect={this.onSelect}
            />
        );
    }
}

TrackSearchContainer.propTypes = {
    spotifyApi: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default TrackSearchContainer;
