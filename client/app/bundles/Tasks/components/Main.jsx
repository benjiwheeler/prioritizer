import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer} from '../TaskActions';

export class NavBar extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export class Main extends React.Component {

  render() {
    return (
      <div>
        <NavBar />
        <div>Other Content</div>
        {this.props.children}
      </div>
    );
  }
}

