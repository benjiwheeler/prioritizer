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

export class TaskFocus extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = TaskStore.getData(["tasksById"]);
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
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

    if (task !== undefined && task !== null) {
      return (
        <div>
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
              <a id="finished_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/done">
                <div className='action-logo'>
                  <i className="fa fa-check"></i>
                </div>
                <div className='shortcut-link'>Finished</div>
              </a>
              <a id="worked_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/worked">
                <div className='action-logo'>
                  <i className="fa fa-gavel"></i>
                </div>
                <div className='shortcut-link'>Worked on it</div>
              </a>
              <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/postpone">
                <div className='action-logo'>
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className='shortcut-link'>Postpone</div>
              </a>
              <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/postpone">
                <div className='action-logo'>
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className='shortcut-link'>Split</div>
              </a>
              <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/postpone">
                <div className='action-logo'>
                  <i className="fa fa-check"></i>
                </div>
                <div className='shortcut-link'>Destroy</div>
              </a>
              <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/postpone">
                <div className='action-logo'>
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className='shortcut-link'>Edit</div>
              </a>
              <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/{task.id}/postpone">
                <div className='action-logo'>
                  <i className="fa fa-clock-o"></i>
                </div>
                <div className='shortcut-link'>New Task</div>
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      console.log("Error: task is null");
      return (
        <div>
        </div>
      );
    }
  }
}

