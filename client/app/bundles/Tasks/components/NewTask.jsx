import React, { PropTypes, Component } from 'react';
import { TaskForm } from './TaskForm.jsx';
import {submitNewTask} from '../TaskActions';
import { ReactDOM } from 'react-dom';
import { NavBar } from './NavBar.jsx';
import { browserHistory, withRouter } from 'react-router';


class NewTask extends React.Component {
  constructor(props) { // list of objects
    super(props);

    let tags = [];
    let tagName = window.globalAppInfo.tagNameOrAll(props.location.query.tagName);
    // default tag to the most frequently used tag
    if (tagName === undefined || tagName === null || tagName === "all") {
      // do nothing; leave tags empty
    } else { //  if we know the tag, use it instead
      tags = [{name: tagName}];
    }
    this.state = {
      task: {
        name: '',
        vital: 3,
        immediate: 3,
        heavy: 3,
        long: 3,
        is_daily: false,
        tags: tags
      },
      tagName: tagName,
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
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tagName: window.globalAppInfo.tagNameOrAll(newProps.location.query.tagName),
      nextPage: this.getNextPageFromPropsAndParams(newProps, newProps.location.query)
    });
  }

  componentDidMount() {
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
      this.props.router.push({pathname: this.state.nextPage.pathname, query: this.state.nextPage.query});
    }
  }

  handleSubmit(task) {
    submitNewTask(task).then(function(response) {
      if (window.globalAppInfo.alertComponent !== undefined &&
          window.globalAppInfo.alertComponent !== null) {
        if (response.success) {
          window.globalAppInfo.alertComponent.show({
            level: "success",
            text: "Created Task"
          });
          this.goToNextPage();
        } else {
          window.globalAppInfo.alertComponent.show({
            level: "danger",
            text: "Failed to create Task: " + response.message
          });
        }
      }
    }.bind(this));
  }

  render() {
    return (
      <div>
        <NavBar tagName={this.state.tagName} backPage={this.state.nextPage} />
        <TaskForm task={this.state.task} tagName={this.state.tagName}
        nextPage={this.state.nextPage} onSubmit={this.handleSubmit.bind(this)} />
      </div>
    );
  }
}
withRouter(NewTask);
export { NewTask };
