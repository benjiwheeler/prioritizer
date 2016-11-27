import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {submitNewTask, fetchTags} from '../TaskActions';
import Select, { Creatable } from 'react-select';
import { Slider } from './Slider';
import { NavBar } from './NavBar.jsx';
import { browserHistory, transitionTo } from 'react-router';
import { ReactDOM } from 'react-dom';


export class NewTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    fetchTags();
    this.state = {
      ...TaskStore.getData(["tagsOrdered"]),
      task: {
        name: '',
        vital: 3,
        immediate: 3,
        heavy: 3,
        long: 3
      },
      tagName: window.globalAppInfo.tagNameOrAll(props.location.query.tagName),
      nextPage: this.getNextPageFromPropsAndParams(props, props.location.query)
    };
    // match the format react-select will provide
    if (props.location.query.tagName !== undefined && props.location.query.tagName !== null) {
      this.state.react_select_tag_list = [
        {label: props.location.query.tagName,
        value: props.location.query.tagName}
      ];
    }
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
    TaskStore.attachListener(this, ["tagsOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tagName: window.globalAppInfo.tagNameOrAll(newProps.location.query.tagName)
    });
  }

  componentDidMount() {
    this.nameInput.focus();
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

  mapReactTags() {
    var newTask = this.state.task;
    if (this.state.react_select_tag_list === undefined || this.state.react_select_tag_list === null) {
      return;
    }
    newTask.tag_list = this.state.react_select_tag_list.map(function(reactSelectTag) {
      return reactSelectTag.value;
    });
    this.setState({
      task: newTask
    });
  }

  goToNextPage() {
    if (this.props.nextPage === undefined || this.props.nextPage === null) {
      browserHistory.goBack();
    } else {
      transitionTo(this.props.nextPage.path, {query: this.props.nextPage.query});
    }
  }


  handleSubmit(e) {
    e.preventDefault();
    this.mapReactTags();
    debugger;
    submitNewTask(this.state.task);
    this.goToNextPage();
  }

  handleSliderChange(kind, value) {
    var newTask = this.state.task;
    newTask[kind] = value;
    this.setState({
      task: newTask
    });
  }

  setEventValue(field, event) {
    this.setFieldValue(field, event.target.value);
  }

  setFieldValue(field, value) {
    var newTask = this.state.task;
    newTask[field] = value;
    this.setState({
      task: newTask
    });
  }

  setTagsValue(value) {
    this.setState({
      react_select_tag_list: value
    });
  }

  render() {
    let tagName = this.state.tagName;
    return (
      <div>
        <NavBar tagName={tagName} to='/tasks' backPage={this.state.nextPage} />
        <form className="new_task" id="new_task" acceptCharset="UTF-8"
        onSubmit={this.handleSubmit.bind(this)}>
          {/* Force Internet Explorer to accept correct character encoding...
           unclear if necessary in react */}
          <input name="utf8" type="hidden" value="&#x2713;" />

          <div className='field'>
            <input
            className="initial-focus form-control"
            placeholder="Task title"
            type="text"
            name="name"
            ref={(input) => { this.nameInput = input; }}
            id="task_name"
            value={this.state.task.name}
            onChange={this.setEventValue.bind(this, "name")}
            />
          </div>
          <div className='field'>
          <Creatable
            name="form-field-name" value="one" multi={true}
            value={this.state.react_select_tag_list}
            options={this.state.tagsOrdered.map(function(tagObj) {
              return { value: tagObj.name, label: tagObj.name };
            })}
            onChange={this.setTagsValue.bind(this)}
            value={this.state.react_select_tag_list}
            tabSelectsValue={false}
            />
          </div>

          <Slider kind="vital" text="Vital" sliderValue={this.state.task.vital} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="immediate" text="Immediate" sliderValue={this.state.task.vital} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="heavy" text="Heavy" sliderValue={this.state.task.vital} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="long" text="Long" sliderValue={this.state.task.vital} onSliderChange={this.handleSliderChange.bind(this)} />

          <div className='actions'>
            <input type="submit" name="commit" value="Save"/>
          </div>
        </form>
      </div>
    );
  }
}

