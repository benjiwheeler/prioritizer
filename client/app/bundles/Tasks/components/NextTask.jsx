import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import { TaskFocus } from './TaskFocus';
import {provideInitialState, requestToServer} from '../TaskActions';


export class NextTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      tasksOrdered: TaskStore.getData(["tasksOrdered"])
    };
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  render() {
    let taskId = null;
    let tasksOrdered = this.state.tasksOrdered;
    if (tasksOrdered !== undefined && tasksOrdered !== null && tasksOrdered.length > 0) {
      taskId = tasksOrdered[0].id;
      return (
        <TaskFocus taskId={taskId} />
      );
    } else {
      return (
        <div>
          --
        </div>
      );
    }

  }
}
NextTask.contextTypes = { // if you want to use this.context, you must define contextTypes
  router: React.PropTypes.object
};
