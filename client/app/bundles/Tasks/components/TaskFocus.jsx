import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, requestToServer, finishTask, deleteTask, postponeTask, workedTask} from '../TaskActions';
import { IconShortcutLink } from './Main';
import { NavBar } from './NavBar.jsx';
import { withRouter } from 'react-router';
import { findProp } from '../../../../lib/CompUtil';
import { fetchTags} from '../TaskActions';

class TaskFocus extends React.Component {
  constructor(props) { // list of objects
    super(props);

    this.state = {
      ...TaskStore.getData(["tasksById"]),
      rowClass: ""
    };
  }

  processProps(newProps) {
    this.setState({
      taskId: findProp("taskId", newProps),
      tagName: window.globalAppInfo.tagNameOrAll(findProp("tagName", newProps)),
      nextPage: this.getNextPage(newProps),
      rowClass: "doFadeIn"
    });
  }

  componentWillReceiveProps(newProps) {
    if (this.state.taskId !== findProp("taskId", newProps)) {
      this.setState({
        rowClass: "doFadeIn"
      });
    }
    this.processProps(newProps);
  }

  getNextPage(props) {
    let nextPage = findProp("nextPage", props);
    if (nextPage !== undefined && props.nextPage !== null) {
      return nextPage;
    }

    // issue here is basically that i'm hacking nextPage, and should make it an obj
    // from the start.
    nextPage = {};
    nextPage.pathname = findProp("nextPagePath", props);
    nextPage.text = findProp("nextPageText", props);
    let tagName = findProp("tagName", props);
    if (tagName !== undefined && tagName !== null) {
      nextPage.query = {tagName: tagName};
    }
    return nextPage;
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
    this.processProps(this.props);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentDidMount() {
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
         <NavBar tagName={this.state.tagName} backPage={this.state.nextPage} />
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
                to={'tasks/' + task.id + '/split'}
                faIconClass='fa-strikethrough'/>
                <IconShortcutLink text='Destroy' id='destroy_link'
                onClick={this.handleDestroy.bind(this, task.id)}
                faIconClass='fa-times'/>
                <IconShortcutLink text='Edit' id='edit_link'
                to={{pathname: 'tasks/' + task.id + '/edit', query: {tagName: this.state.tagName, nextPagePath: ('tasks/' + task.id), nextPageText: 'This task'}}}
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
withRouter(TaskFocus);
export { TaskFocus };
