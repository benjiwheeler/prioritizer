import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer, finishTask, deleteTask, postponeTask, workedTask} from '../TaskActions';
import { IconShortcutLink } from './Main';
import { NavBar } from './NavBar.jsx';

export class TaskFocus extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksById"]),
      taskId: this.getTaskIdFromProps(props),
      tagName: props.tagName,
      rowClass: ""
    };
  }

  // Three ways to get task ID:
  // 1.  provided directly from another jsx tag
  // 2.  provided via URL like /tasks/24 , via props.params
  // 3.  provided via query string like... i don't know, this is just in case
  getTaskIdFromProps(props) {
    let taskId = props.taskId;
    if (taskId === undefined || taskId === null) {
      if (props.location.query.taskId !== undefined && props.location.query.taskId !== null) {
        taskId = props.location.query.taskId;
      }
      if (props.params.taskId !== undefined && props.params.taskId !== null) {
        taskId = props.params.taskId;
      }
    }
    return taskId;
  }

  componentWillReceiveProps(newProps) {
    if (this.state.taskId !== this.getTaskIdFromProps(newProps)) {
      this.setState({
        taskId: this.getTaskIdFromProps(newProps),
        tagName: newProps.tagName,
        rowClass: "doFadeIn"
      });
    }
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  handleFinish(taskId, e) {
    e.preventDefault();
    this.setState({
      rowClass: "doComplete"
    });
    setTimeout(function() {
      finishTask(taskId);
    }.bind(this), 0);
  }

  handleWorked(taskId, e) {
    e.preventDefault();
    this.setState({
      rowClass: "doComplete"
    });
    setTimeout(function() {
      workedTask(taskId);
    }.bind(this), 0);
  }
  handlePostpone(taskId, e) {
    e.preventDefault();
    this.setState({
      rowClass: "doDelete"
    });
    setTimeout(function() {
      postponeTask(taskId);
    }.bind(this), 0);

  }

  handleDestroy(taskId, e) {
    e.preventDefault();
    this.setState({
      rowClass: "doDelete"
    });
    setTimeout(function() {
      deleteTask(taskId);
    }.bind(this), 0);

  }

  render() {
    let task = null;
    if (this.state.taskId !== undefined && this.state.taskId !== null) {
      task = this.state.tasksById[this.state.taskId];
    }
    let navBarIfNesc = null;
    if (this.props.showNavBar !== false) {
      navBarIfNesc = (
         <NavBar tagName={this.state.tagName} to='/tasks' />
      );
    }

    if (task !== undefined && task !== null) {
      return (
        <div>
          {navBarIfNesc}
          <div className={this.state.rowClass}>
            <div className='row'>
              <div className='col-xs-8'>
                <div className='h3'>
                  {task.name}
                </div>
              </div>
              <div className='col-xs-4'>
                <div id='countdown'></div>
                <a id='moreTimeButton'>More time</a>
                <a id='playButton'>Play</a>
                <a id='pauseButton'>Pause</a>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-3'>Actions:</div>
              <div className='col-xs-9'>
                <IconShortcutLink text='Finished' id='finished_link'
                onClick={this.handleFinish.bind(this, task.id)}
                faIconClass='fa-check'/>
                <IconShortcutLink text='Worked on it' id='worked_link'
                onClick={this.handleWorked.bind(this, task.id)}
                faIconClass='fa-gavel'/>
                <IconShortcutLink text='Postpone' id='postpone_link'
                onClick={this.handlePostpone.bind(this, task.id)}
                faIconClass='fa-clock-o'/>
                <IconShortcutLink text='Split' id='split_link'
                to={'tasks/' + task.id + 'split'}
                faIconClass='fa-strikethrough'/>
                <IconShortcutLink text='Destroy' id='destroy_link'
                onClick={this.handleDestroy.bind(this, task.id)}
                faIconClass='fa-times'/>
                <IconShortcutLink text='Edit' id='edit_link'
                to={'tasks/' + task.id + 'edit'}
                faIconClass='fa-pencil'/>
                <IconShortcutLink text='New Task' id='new_task_link'
                to={{pathname: 'tasks/new', query: {tagName: this.state.tagName}}}
                faIconClass='fa-lightbulb-o'/>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      console.log("Warning: task is null");
      return (
        <div>
        </div>
      );
    }
  }
}

