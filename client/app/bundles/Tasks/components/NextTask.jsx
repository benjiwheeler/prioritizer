import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import { TaskFocus } from './TaskFocus';
import {provideInitialState, requestToServer} from '../TaskActions';
import { NavBar } from './NavBar.jsx';


export class NextTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksByTagOrdered"]),
      tagName: window.globalAppInfo.tagNameOrAll(props.params.tagName)
    };
    console.log("NextTask mounted");
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksByTagOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  render() {
    let taskId = null;
    let tasksByTagOrdered = this.state.tasksByTagOrdered;
    let tagName = this.state.tagName;
    if (tasksByTagOrdered !== undefined && tasksByTagOrdered !== null &&
      tasksByTagOrdered[tagName] !== undefined && tasksByTagOrdered[tagName] !== null &&
      tasksByTagOrdered[tagName].length > 0) {
      taskId = tasksByTagOrdered[tagName][0].id;
      return (
        <div>
          <NavBar tagName={this.props.params.tagName} to='/tasks/next' />
          <TaskFocus taskId={taskId} showNavBar={false}/>
        </div>
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
