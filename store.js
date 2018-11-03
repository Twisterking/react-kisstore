import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '../components/Loading';

const MainContext = React.createContext('main');

export const withMainContext = withTracker((props) => {
  const loggingIn = Meteor.loggingIn()
  return {
    currentUser: Meteor.user(),
    loggingIn,
    authenticated: !loggingIn && !!Meteor.userId()
  }
})

class MainStore extends React.Component {
  constructor(props) {
    super(props);
    this.update = (props) => {
      props = _.omit(props, 'children');
      if(areEqual(props, this.state.current)) return;
      this.setState(state => {
        Object.assign(state.current, props);
        return state;
      })
    }
    this.state = {
      current: _.omit(props, 'children'),
      update: this.update
    }
  }
  static getDerivedStateFromProps(props, state) {
    Object.assign(state.current, _.omit(props, 'children'));
    return state;
  }
  render() {
    return (
      <MainContext.Provider value={this.state}>
        {this.props.children}
      </MainContext.Provider>
    )
  }
}

export const MainProvider = withMainContext(MainStore);
export const MainConsumer = MainContext.Consumer;

export const withMainStore = (Component) => {
  return (props) => {
    return (
      <MainConsumer>
        {store => (
          <Component store={store} {...props} />
        )}
      </MainConsumer>
    )
  }
}

export const areEqual = (a, b) => {
  for(var key in a) {
    if((typeof a[key] !== 'undefined' && typeof b[key] == 'undefined') || (a[key] !== b[key])) {
      return false;
    }
  }
  return true;
}
