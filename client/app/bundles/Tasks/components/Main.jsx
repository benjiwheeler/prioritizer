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
    var curRoute = this.props.routes[this.props.routes.length - 1];
    console.log("curRoute:");
    console.log(curRoute);
    console.log(curRoute.name);
    console.log(curRoute.component);
    return (
      <div>
        Main
        <NavBar />
        <div>Other Content</div>
        {this.props.children}
      </div>
    );
  }
}

