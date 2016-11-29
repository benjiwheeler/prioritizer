import React, { PropTypes, Component } from 'react';
import { TaskForm } from './TaskForm.jsx';
import TaskStore from '../store/TaskStore.js';
import { ReactDOM } from 'react-dom';


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


  handleSubmit(task) {
    submitNewTask(task);
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
        <TaskForm task={task} tagName={this.state.tagName}
        nextPage={this.state.nextPage} onSubmit={this.handleSubmit.bind(this)} />
      );
    }
  }
}

