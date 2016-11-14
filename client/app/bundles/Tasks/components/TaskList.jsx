import React, { PropTypes } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer} from '../TaskActions'


export class Task extends React.Component {

  render() {
    return (
      <div>
        A task:
        { this.props.task.name }
      </div>
    );
  }

}

export default class TaskList extends React.Component {

  constructor(props) { // list of objects
    super(props);
    this.state = TaskStore.getData(["tasks"]);
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasks"]);
    provideInitialState();
    //requestToServer();
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  render() {
    let { tasks } = this.state;
    var allTasks = tasks.map((task, index) => (
        <Task key={index} task={task} />
      ));

    return (
      <div>
        Tasks go here!
        { allTasks }
      </div>
    );
  }
}
