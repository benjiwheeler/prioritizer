import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer, finishTask, deleteTask} from '../TaskActions';

export class TaskFocus extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksById"]),
      taskId: this.getTaskIdFromProps(props),
      rowClass: ""
    };
  }

  getTaskIdFromProps(props) {
    let taskId = props.taskId;
    if ((taskId === undefined || taskId === null) &&
        (props.params !== undefined && props.params !== null)) {
      taskId = props.params.taskId;
    }
    return taskId
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      taskId: this.getTaskIdFromProps(newProps),
      rowClass: "doFadeIn"
    });
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  markFinished(taskId, e) {
    e.preventDefault();
    this.setState({
      rowClass: "doComplete"
    });
    setTimeout(function() {
      finishTask(taskId);
    }.bind(this), 1000);

  }

  render() {
    let task = null;
    if (this.state.taskId !== undefined && this.state.taskId !== null) {
      task = this.state.tasksById[this.state.taskId];
    }

    if (task !== undefined && task !== null) {
      return (
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
              <a id="finished_link" className="action-link" rel="nofollow" data-method="post" href="" onClick={this.markFinished.bind(this, task.id)}>
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
      console.log("Warning: task is null");
      return (
        <div>
        </div>
      );
    }
  }
}

