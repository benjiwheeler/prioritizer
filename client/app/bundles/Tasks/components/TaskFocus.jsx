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
        <div className='row'>
          <div className='col-xs-8'>
            <div className='h3'>
              task name
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
            <a id="finished_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/92/done">
              <div className='action-logo'>
                <i className="fa fa-check"></i>
              </div>
              <div className='shortcut-link'>Finished</div>
            </a>
            <a id="worked_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/92/worked">
              <div className='action-logo'>
                <i className="fa fa-gavel"></i>
              </div>
              <div className='shortcut-link'>Worked on it</div>
            </a>
            <a id="postpone_link" className="action-link" rel="nofollow" data-method="post" href="/tasks/92/postpone">
              <div className='action-logo'>
                <i className="fa fa-clock-o"></i>
              </div>
              <div className='shortcut-link'>Postpone</div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

