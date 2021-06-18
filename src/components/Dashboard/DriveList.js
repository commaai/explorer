import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';
import Colors from '../../colors';

import { withStyles, Typography, Grid } from '@material-ui/core';
import DriveListItem from './DriveListItem';
import ResizeHandler from '../ResizeHandler';
import { deviceTypePretty } from '../../utils'

const MIN_TIME_BETWEEN_ROUTES = 60000; // 1 minute

const styles = (theme) => ({
  header: {
    alignItems: 'center',
    borderBottom: `1px solid ${Colors.white10}`,
    padding: '16px 48px',
    flexGrow: 0,
  },
  drivesTable: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  drives: {
    margin: 0,
    padding: '16px 12px',
    flex: '1',
  },
  zeroState: {
    padding: '16px 48px',
    flex: '0',
  },
  settingsArea: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  settingsButton: {
    position: 'relative',
    left: 12,
    border: `1px solid ${Colors.white40}`
  },
  settingsButtonIcon: {
    color: Colors.white40,
  },
});

class DriveList extends Component {
  constructor(props) {
    super(props);

    this.filterShortDrives = this.filterShortDrives.bind(this);
    this.renderDriveListHeader = this.renderDriveListHeader.bind(this);
    this.onResize = this.onResize.bind(this);

    this.state = {
      windowWidth: window.innerWidth,
    };
  }

  componentWillReceiveProps(props) {
    if (props.device && !this.state.deviceAliasSaved) {
      this.setState({ deviceAliasSaved: props.device.alias });
    }
  }

  filterShortDrives(ride) {
    return ride.duration > 60000;
  }

  onResize(windowWidth) {
    this.setState({ windowWidth });
  }

  render() {
    const { classes } = this.props;

    const driveList = [];
    let lastEnd = 0;
    let lastSegmentEnd = 0;
    let curRideChunk = null;
    this.props.segments.forEach((segment) => {
      if (!curRideChunk || segment.startTime - lastEnd > MIN_TIME_BETWEEN_ROUTES) {
        curRideChunk = {
          segments: 0,
          startTime: segment.startTime,
          offset: segment.offset,
          duration: 0,
          startCoord: segment.startCoord,
          endCoord: segment.endCoord,
          distanceMiles: segment.distanceMiles,
        };
        driveList.unshift(curRideChunk);
        lastSegmentEnd = segment.startTime;
      }
      curRideChunk.duration += segment.startTime - lastSegmentEnd;
      curRideChunk.duration += segment.duration;
      lastSegmentEnd = segment.startTime + segment.duration;
      curRideChunk.segments++;
      lastEnd = segment.startTime + segment.duration;
    });

    return (
      <>
        { this.renderDriveListHeader() }
        <div className={ classes.drivesTable }>
          { driveList.length === 0 && this.renderZeroRides() }
          <ul className={classes.drives}>
            { driveList.filter(this.filterShortDrives).map((drive) => (
              <DriveListItem key={drive.startTime} drive={drive} windowWidth={ this.state.windowWidth }/>
            ))}
          </ul>
        </div>
      </>
    );
  }

  renderZeroRides() {
    const { classes } = this.props;
    let zeroRidesEle = null;
    const { device, segmentData } = this.props;

    if (device && (segmentData === null || typeof segmentData.segments === 'undefined')) {
      zeroRidesEle = <Typography>Loading...</Typography>;
    } else if (segmentData && segmentData.segments && segmentData.segments.length === 0) {
      zeroRidesEle = ( <Typography>Looks like you haven{'\''}t driven in the selected time range.</Typography> );
    }

    return (
      <div className={classes.zeroState}>
        <Grid container>
          { zeroRidesEle }
        </Grid>
      </div>
    );
  }

  renderDriveListHeader() {
    const { classes } = this.props;
    const isMedium = this.state.windowWidth < 768;
    const isSmall = this.state.windowWidth < 640;
    const deviceStyle = isSmall ?
      { flexGrow: 0, maxWidth: '90%', flexBasis: '90%' } :
      { flexGrow: 0, maxWidth: 'calc(26% + 12px)', flexBasis: 'calc(26% + 12px)', marginLeft: -12 };
    return (
      <div className={classes.header}>
        <ResizeHandler onResize={ this.onResize } />
        <Grid container alignItems="center">
          <div style={ deviceStyle }>
            <Typography variant="title">Drives</Typography>
          </div>
          { !isSmall && <>
            <div style={{ flexGrow: 0, maxWidth: '14%', flexBasis: '14%' }}>
              <Typography variant="subheading">Duration</Typography>
            </div>
            <div style={{ flexGrow: 0, maxWidth: '22%', flexBasis: '22%' }}>
              <Typography variant="subheading">Origin</Typography>
            </div>
            <div style={{ flexGrow: 0, maxWidth: '22%', flexBasis: '22%' }}>
              <Typography variant="subheading">Destination</Typography>
            </div>
            <div style={{ flexGrow: 0, maxWidth: '10%', flexBasis: '10%' }}>
              <Typography variant="subheading">{ isMedium ? 'Dist.' : 'Distance' }</Typography>
            </div>
          </> }
        </Grid>
      </div>
    );
  }
}

const stateToProps = Obstruction({
  segments: 'workerState.segments',
  segmentData: 'workerState.segmentData',
  start: 'workerState.start',
  device: 'workerState.device',
  dongleId: 'workerState.dongleId',
  isSuperUser: 'workerState.profile.superuser',
});

export default connect(stateToProps)(withStyles(styles)(DriveList));
