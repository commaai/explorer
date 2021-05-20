import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import { withStyles, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import Media from './Media';
import Timeline from '../Timeline';
import DriveViewFooter from './footer';

import { selectRange } from '../../actions';
import ResizeHandler from '../ResizeHandler';

const styles = (theme) => ({
  window: {
    background: 'linear-gradient(to bottom, #30373B 0%, #272D30 10%, #1D2225 100%)',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: 18,
  },
  header: {},
  headerContext: {
    alignItems: 'center',
    display: 'flex',
    padding: 12,
    paddingLeft: 18,
    paddingRight: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 700,
    paddingLeft: 12,
  },
  headerActions: {
    marginLeft: 'auto',
  },
  headerTimeline: {},
  viewer: {
    padding: theme.spacing.unit * 4,
  },
});

class DriveView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: window.innerWidth,
    };

    this.close = this.close.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  close() {
    this.props.dispatch(selectRange(null, null));
  }

  onResize(windowWidth) {
    this.setState({ windowWidth });
  }

  render() {
    const {
      classes,
      device,
      loop,
      currentSegment,
      nextSegment,
      start
    } = this.props;
    const visibleSegment = (currentSegment || nextSegment);
    const routeName = visibleSegment ? visibleSegment.route : 'Nothing visible';
    const shortName = routeName.split('|')[1];
    const isLg = this.state.windowWidth >= 1280;
    return (
      <>
        <ResizeHandler onResize={ this.onResize } />
        <div className={classes.window}>
          <div className={classes.header}>
            <div className={classes.headerContext}>
              <IconButton aria-label="Go Back" onClick={() => window.history.back()}>
                <KeyboardBackspaceIcon />
              </IconButton>
              <Typography className={classes.headerTitle}>
                { this.props.device.alias }
              </Typography>
              <div className={classes.headerActions}>
                <IconButton onClick={this.close} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <Timeline
              className={classes.headerTimeline}
              zoomed
              colored
              hasThumbnails
              hasRuler
              hasGradient
              tooltipped
              dragSelection
            />
          </div>
          <div className={classes.viewer}>
            <Media />
          </div>
        </div>
        { visibleSegment && <DriveViewFooter segment={visibleSegment} loop={loop} start={start} /> }
      </>
    );
  }
}

const stateToProps = Obstruction({
  currentSegment: 'workerState.currentSegment',
  nextSegment: 'workerState.nextSegment',
  device: 'workerState.device',
  loop: 'workerState.loop',
  start: 'workerState.start'
});

export default connect(stateToProps)(withStyles(styles)(DriveView));
