import React, { Component } from 'react';
import { connect } from 'react-redux';
import Obstruction from 'obstruction';

import PrimeManage from './PrimeManage';
import PrimeOverview from './PrimeOverview';

class Prime extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    if (this.props.subscription) {
      return ( <PrimeManage /> );
    }
    return ( <PrimeOverview /> );
  }
}

const stateToProps = Obstruction({
  subscription: 'workerState.subscription',
});

export default connect(stateToProps)(Prime);
