import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer} from '../TaskActions';


export class NextTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = TaskStore.getData(["tasksOrdered"]);
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  render() {
    let task = null;
    let { tasksOrdered } = this.state;
    if (tasksOrdered !== undefined && tasksOrdered !== null && tasksOrdered.length > 0) {
      task = tasksOrdered[0];
    }

    return (
      <TaskFocus taskId={task.id}>
      </TaskFocus>
    );
  }
}
