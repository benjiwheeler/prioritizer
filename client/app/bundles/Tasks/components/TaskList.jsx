import React, { PropTypes } from 'react';
import Component from 'react';
import TaskStore from '../store/TaskStore.js';
import {deleteTask} from '../TaskActions';
import { Router, Route, Link, browserHistory } from 'react-router'


export class CircleCell extends React.Component {
  constructor(props) { // list of objects
    super(props);
    var smallest_size = 3;
    var scale_factor = 1.5;
    this.size = props.size;
    if (props.size === undefined || props.size === null) {
      this.size = 1;
    }
    this.size = scale_factor * (this.size + smallest_size)/(10.0 + smallest_size);
    this.spacer_size = scale_factor * smallest_size/(10.0 + smallest_size);
    this.spacer_size -= this.size / 2.0;
    this.spacer_size += 0.2; // extra spacing
    this.color = props.color;
  }

  render() {
    return (
      <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.7rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
        <div className="circle" style={{backgroundColor: this.color, width: this.size + 'em', height: this.size + 'em', marginLeft: this.spacer_size + 'em', marginTop: (this.spacer_size + 0.5) + 'em'}}></div>
      </td>
    );
  }
}
CircleCell.propTypes = {
  size: React.PropTypes.number,
  color: React.PropTypes.string
};


export class TaskListable extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = TaskStore.getData(["tasksById"]);
    this.taskId = props.taskId;
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  attemptDelete(e) {
    e.preventDefault();
    var retVal = confirm("Sure?");
    if (retVal === true) {
      TaskActions.deleteTask(this.taskId);
    } else {
    }
  }

  render() {
    let task = null;
    let { tasksById } = this.state;
    if (this.props.taskId !== undefined && this.props.taskId !== null) {
      task = tasksById[this.props.taskId];
    } else if (this.props.params !== undefined && this.props.params !== null &&
      this.props.params.taskId !== undefined && this.props.params.taskId !== null) {
      task = tasksById[this.props.params.taskId];
    }

    return (
      <tr>
        <td className="break-text" style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.5rem', paddingBottom: '.6rem', verticalAlign: 'middle', lineHeight: '1em', width: '100%'}}>
          <Link to={"/tasks/" + task.id}>
            { task.name }
          </Link>
        </td>
        <CircleCell size={Number(task.vital)} color="#09bc36" />
        <CircleCell size={Number(task.immediate)} color="#f9d507" />
        <CircleCell size={Number(task.heavy)} color="#ed1409" />
        <CircleCell size={Number(task.long)} color="#1061e5" />
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-play-circle"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link" onClick={this.attemptDelete}>
            <div className="list-action-logo">
              <i className="fa fa-times"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-check"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-check"></i>
            </div>
          </a>
        </td>
      </tr>
    );
  }
}
TaskListable.contextTypes = { // if you want to use this.context, you must define contextTypes
  router: React.PropTypes.object
};


export class TaskList extends React.Component {

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
    let { tasksOrdered } = this.state;
    let allTasksJsx = (<tr></tr>);
    if (tasksOrdered !== undefined && tasksOrdered !== null) {
      allTasksJsx = tasksOrdered.map((task, index) => (
        <TaskListable key={index} taskId={task.id} />
      ));
    }

    return (
      <div>
        Tasks go here!
        <table className="table" style={{marginTop: '6rem'}}>
          <thead>
            <tr>
              <th className="col-xs-4 col-md-4 list-header-text">Task</th>
              <th className="col-xs-1 col-md-1 list-header-text">Vital</th>
              <th className="col-xs-1 col-md-1 list-header-text">Imm.</th>
              <th className="col-xs-1 col-md-1 list-header-text">Heavy</th>
              <th className="col-xs-1 col-md-1 list-header-text">Long</th>
              <th className="col-xs-1 col-md-1 list-header-text">Start</th>
              <th className="col-xs-1 col-md-1 list-header-text">Del.</th>
              <th className="col-xs-1 col-md-1 list-header-text">Edit</th>
              <th className="col-xs-1 col-md-1 list-header-text">Done</th>
            </tr>
          </thead>
          <tbody>
            { allTasksJsx }
          </tbody>
        </table>
      </div>
    );
  }
}
