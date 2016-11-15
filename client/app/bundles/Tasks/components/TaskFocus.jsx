import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer} from '../TaskActions';


export class NextTask extends React.Component {
  render() {
    return (
      <div>
      Next task here
      </div>
    );
  }
}

export class TaskFocus extends React.Component {

  render() {
    return (
      <div>
        Focus here
      </div>
    );
  }
}

