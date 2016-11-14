import React, { PropTypes } from 'react';


export class Task extends React.Component {

  render() {
    return (
      <div>
        A task:
        { this.props.name }
      </div>
    );
  }

}

export default class TaskList extends React.Component {

  constructor(props) { // list of objects
    super(props);
    this.state = {
      tasks: [
        {name: "task1"},
        {name: "task2"},
        {name: "task3"}
      ]
    }
  }

  render() {
    let { tasks } = this.state;
    var allTasks = tasks.map((task, index) => (
        <Task key={index} name={task.name} />
      ));

    return (
      <div>
        Tasks go here!
        { allTasks }
      </div>
    );
  }
}
