import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';
import { withStyles, Typography, Button } from '@material-ui/core';

import { primeNav } from '../../actions';
import PrimeChecklist from './PrimeChecklist';
import Colors from '../../colors';
import ResizeHandler from '../ResizeHandler';

const styles = () => ({
  primeContainer: {
    padding: 16,
    borderBottom: `1px solid ${Colors.white10}`,
    color: Colors.white,
  },
  introLine: {
    display: 'inline',
    lineHeight: '23px',
  },
  checkList: {
    marginLeft: 10,
    marginBottom: 10,
  },
  checkListItem: {
    padding: '5px 0',
    '& svg': { margin: 0 },
  },
  moreInfoButton: {
    borderRadius: 30,
    minHeight: 'unset',
    padding: '2px 8px',
    marginLeft: '15px',
    display: 'inline',
  },
  activateButton: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    color: '#404B4F',
    textTransform: 'none',
    width: 300,
    maxWidth: '100%',
    '&:hover': {
      backgroundColor: Colors.white70,
      color: '#404B4F',
    }
  },
});

class PrimeBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moreInfo: (!props.collapsed),
      windowWidth: window.innerWidth,
    };
  }

  render() {
    const { classes } = this.props;
    const { windowWidth, moreInfo } = this.state;

    const containerPadding = windowWidth > 520 ? 36 : 16;

    return (
      <div className={ classes.primeContainer } style={{ padding: `16px ${containerPadding}px` }}>
        <ResizeHandler onResize={ (windowWidth) => this.setState({ windowWidth }) } />
        <Typography variant="title">comma prime</Typography>
        <Typography classes={{ root: classes.introLine }}>
          Become a comma prime member today for only $24/month
        </Typography>
        { moreInfo ? <>
          <PrimeChecklist />
          <Button size="large" className={ classes.activateButton }
            onClick={ () => this.props.dispatch(primeNav()) }>
            Activate comma prime
          </Button>
        </> :
          <Button onClick={ () => this.setState({ moreInfo: true }) } className={ classes.moreInfoButton }>
            More info
          </Button>
        }
      </div>
    );
  }
}

const stateToProps = Obstruction({});

export default connect(stateToProps)(withStyles(styles)(PrimeBanner));
