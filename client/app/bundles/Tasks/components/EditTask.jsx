import React, { PropTypes, Component } from 'react';
import { TaskForm } from './TaskForm.jsx';
import TaskStore from '../store/TaskStore.js';
import {updateTask} from '../TaskActions';
import { ReactDOM } from 'react-dom';
import { NavBar } from './NavBar.jsx';
import { browserHistory, transitionTo } from 'react-router';


export class EditTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksById"]),
      taskId: this.getTaskIdFromProps(props),
      tagName: window.globalAppInfo.tagNameOrAll(props.location.query.tagName),
      nextPage: this.getNextPageFromPropsAndParams(props, props.location.query)
    };

        // "task[name]": '',
        // "task[id]": '',
        // "task[notes]": '',
        // "task[due]": '',
        // "task[time_of_day]": '',
        // "task[parent_id]": '',
        // "task[vital]": '',
        // "task[immediate]": '',
        // "task[heavy]": '',
        // "task[long]": '',
        // "task[position]": '',
        // "task[exp_dur_mins]": '',
        // "task[min_dur_mins]": '',
        // "task[is_daily]": '',
        // "task[tag_list]": [],
        // "task[children_attributes]": {}
        // [:id, :name, :notes, :due, :time_of_day, :parent_id,
        // :vital, :immediate, :heavy, :long, :position, :exp_dur_mins,
        // :min_dur_mins, tag_list: []])
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksById"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      taskId: this.getTaskIdFromProps(newProps),
      tagName: window.globalAppInfo.tagNameOrAll(newProps.location.query.tagName),
      nextPage: this.getNextPageFromPropsAndParams(newProps, newProps.location.query)
    });
  }

  componentDidMount() {
  }

  // Two ways to get task ID:
  // 1.  provided directly from another jsx tag
  // 2.  provided via URL like /tasks/24 , via props.params
  getTaskIdFromProps(props) {
    let taskId = props.taskId;
    if (taskId === undefined || taskId === null) {
      if (props.params.taskId !== undefined && props.params.taskId !== null) {
        taskId = props.params.taskId;
      }
    }
    return taskId;
  }

  getNextPageFromPropsAndParams(props, params) {
    if (props.nextPage !== undefined && props.nextPage !== null) {
      return props.nextPage;
    } else if (params.nextPagePath !== undefined && params.nextPagePath !== null) {
      let nextPage = {};
      nextPage.pathname = params.nextPagePath;
      if (params.nextPageText !== undefined && params.nextPageText !== null) {
        nextPage.text = params.nextPageText;
      }
      if (params.tagName !== undefined && params.tagName !== null) {
        nextPage.query = {tagName: params.tagName};
      }
      return nextPage;
    }
    return null;
  }


  goToNextPage() {
    if (this.state.nextPage === undefined || this.state.nextPage === null) {
      browserHistory.goBack();
    } else {
      transitionTo(this.state.nextPage.path, {query: this.state.nextPage.query});
    }
  }

  handleSubmit(task) {
    let reactThis = this;
    updateTask(task).then(function(success) {
      if (window.globalAppInfo.alertComponent !== undefined &&
          window.globalAppInfo.alertComponent !== null) {
        if (success) {
          window.globalAppInfo.alertComponent.show({
            level: "success",
            text: "Updated Task"
          });
          reactThis.goToNextPage();
        } else {
          window.globalAppInfo.alertComponent.show({
            level: "danger",
            text: "Failed to update Task"
          });
        }
      }
    });
  }

  render() {
    let task = null;
    if (this.state.taskId !== undefined && this.state.taskId !== null) {
      task = this.state.tasksById[this.state.taskId];
    }
    if (task === undefined || task === null) {
      return (
        <div />
      );
    } else {
      return (
        <div>
          <NavBar tagName={this.state.tagName} to='/tasks' backPage={this.state.nextPage} />
          <TaskForm task={task} tagName={this.state.tagName}
          nextPage={this.state.nextPage} onSubmit={this.handleSubmit.bind(this)} />
        </div>
      );
    }
  }
}

