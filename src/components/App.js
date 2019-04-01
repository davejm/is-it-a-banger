import React, {Component, Fragment} from 'react';
import CssBaseline from 'material-ui/CssBaseline';
import AppBar from './AppBar';
import TrackSearchContainer from '../containers/TrackSearchContainer';
import LoginContainer from '../containers/LoginContainer';
import withSpotifyApi from '../hocs/SpotifyApi';
import { withStyles, MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
// import TextField from 'material-ui/TextField';
// import omit from 'lodash.omit';
import SelectedTrack from './SelectedTrack';
import DeciderContainer from '../containers/DeciderContainer';
import FlashMessage from './FlashMessage';
import {compose} from 'recompose';
import Typography from 'material-ui/Typography';
import ReactGA from 'react-ga';

const redirectUri = (window.location.hostname === 'localhost')
    ? "http://localhost:3000/callback.html"
    : process.env.REACT_APP_PUBLIC_CALLBACK_URL;

const clientId = process.env.REACT_APP_CLIENT_ID;

const styles = (theme) => ({
    intro: {
        marginBottom: theme.spacing.unit * 4,
        textAlign: 'center'
    },
    content: {
        padding: 20,
        paddingTop: 40
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#76d275',
            main: '#43a047',
            dark: '#00701a',
            contrastText: '#fafafa',
        },
        secondary: {
            light: '#c3fdff',
            main: '#90caf9',
            dark: '#5d99c6',
            contrastText: '#fafafa',
        }
    }
});

class App extends Component {
    state = {
        auth: false,
        selectedTrack: null,
        notification: {
            open: false,
            text: '',
            openUrl: null,
            autoHideDuration: null
        }
    };

    componentDidMount() {
        const googleId = process.env.REACT_APP_GOOGLE_ID;
        if (googleId) {
            ReactGA.initialize(googleId);
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
    }

    handleAuthorized = () => {
        // console.log('authorized');
        this.setState({auth: true});
    };

    handleTrackSelect = (selectedTrack) => {
        // console.log(selectedTrack);
        this.setState((prevState, props) => ({
            selectedTrack
        }));
    };

    showNotification = (text, openUrl = null, autoHideDuration = 4000) => {
        // this.closeNotification();
        this.setState({
            notification: {
                open: true,
                text,
                openUrl,
                autoHideDuration
            }
        });
    };

    closeNotification = () => {
        this.setState((prevState, props) => ({
            notification: {
                ...prevState.notification,
                open: false
            }
        }))
    };

    handleSuccess = () => {
        this.setState({
            trackName: ''
        });
    };

    render() {
        const {spotifyApi, classes} = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar/>
                <div className={classes.content}>
                    {this.state.auth
                        ? (
                            <Fragment>
                                <TrackSearchContainer spotifyApi={spotifyApi} onSelect={this.handleTrackSelect}/>
                                {this.state.selectedTrack && (
                                    <SelectedTrack name={this.state.selectedTrack.name} image={this.state.selectedTrack.imageHiRes}/>
                                )}
                                <DeciderContainer
                                    spotifyApi={spotifyApi}
                                    track={this.state.selectedTrack}
                                    showNotification={this.showNotification}
                                    onSuccess={this.handleSuccess}
                                />
                            </Fragment>
                        )
                        : (
                            <Fragment>
                                <div className={classes.intro}>
                                    <Typography variant='title' gutterBottom>What does this do?</Typography>
                                    <Typography>
                                        Tells you if a song is a banger or not.
                                    </Typography>
                                </div>
                                <LoginContainer spotifyApi={spotifyApi} onAuthorize={this.handleAuthorized} showNotification={this.showNotification}/>
                            </Fragment>
                        )
                    }
                </div>
                <FlashMessage
                    open={this.state.notification.open}
                    text={this.state.notification.text}
                    onClose={this.closeNotification}
                    openUrl={this.state.notification.openUrl}
                    autoHideDuration={this.state.notification.autoHideDuration}
                />
            </MuiThemeProvider>
        );
    }
}

const enhance = compose(
    withStyles(styles),
    withSpotifyApi(clientId, redirectUri)
);

export default enhance(App);
