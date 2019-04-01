import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import withStyles from 'material-ui/styles/withStyles';

const styles = (theme) => ({
    button: {
        marginTop: theme.spacing.unit * 3
    }
});

class Decider extends Component {
    render() {
        return (
            <Button color="primary" variant="raised" size="large" disabled={!this.props.enabled} fullWidth className={this.props.classes.button} onClick={this.props.onClick}>
                Banger?
            </Button>
        );
    }
}

Decider.propTypes = {
    onClick: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired
};

export default withStyles(styles)(Decider);
