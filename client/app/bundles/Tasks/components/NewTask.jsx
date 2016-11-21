import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {submitNewTask} from '../TaskActions';
import Select, { Creatable } from 'react-select';

export class Slider extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      value: props.sliderValue
    };
  }

  onSliderChange(sliderValInput, e) {
    this.setState({
      value: sliderValInput.value
    });
    this.props.onSliderChange(this.props.kind, sliderValInput.value);
  }

  // note that onChange won't work for the hidden field because it's set by
  // jquery, whose val() function doesn't trigger onChange.
  // Instead, we keep a ref to that element, and grab its val onBlur.
  render() {
    return (
      <div className='row' style={{marginTop: '5px'}}>
        <div className='col-xs-3'>
          <div style={{paddingLeft: '5px'}}>
            <i className='icon-down-right-arrow'
            style={{float: 'left', position: 'relative'}}></i>
            <label htmlFor={'task_' + this.props.kind}>{this.props.text}</label>
            &nbsp;<span id={this.props.kind + '_slider_amount_shown'}
            style={{border: 0, color: '#f6931f', fontWeight: 'bold'}}></span>
            <input id={this.props.kind + '_slider_amount_hidden'}
            name={this.props.kind}
            type='hidden' value={this.state.value}
            ref={(sliderValInput) => { this.sliderValInput = sliderValInput; }}
            />
          </div>
        </div>
        <div className='field col-xs-9'>
          <div className='imp_slider' id={this.props.kind + '_slider'}
          style={{marginTop: '3px'}}
          onBlur={this.onSliderChange.bind(this, this.sliderValInput)} ></div>
        </div>
      </div>
    );
  }
}

export class NewTask extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      tagsOrdered: TaskStore.getData(["tagsOrdered"]),
      task: {
        name: '',
        vital: 3,
        immediate: 3,
        heavy: 3,
        long: 3
      }
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
    TaskStore.attachListener(this, ["tagsOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
    // if (this.state.taskId !== this.getTaskIdFromProps(newProps)) {
    //   this.setState({
    //     taskId: this.getTaskIdFromProps(newProps),
    //     rowClass: "doFadeIn"
    //   });
    // }
  }

  mapReactTags() {
    var newTask = this.state.task;
    newTask.tag_list = this.state.react_select_tag_list.map(function(reactSelectTag) {
      return reactSelectTag.value;
    }).join(",");
    this.setState({
      task: newTask
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.mapReactTags();
    debugger;
    submitNewTask(this.state.task);
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
    let tagsOrdered = this.state.tagsOrdered;
    // NOTE: make this dynamic, using selected in select tag?? or input tag??
{/*
      <option value="new">new</option>
      <option value="ben">ben</option>
      <option value="romance">romance</option>
      <option value="all">all</option>

*/}
    return (
      <div>
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
          id="task_name"
          value={this.state.task.name}
          onChange={this.setEventValue.bind(this, "name")}
          />
        </div>
        <div className='field'>
<Creatable
    name="form-field-name"
    value="one"
    multi={true}
    value={this.state.react_select_tag_list}
    options={['cool', 'test', 'home'].map(function(tagStr) {
      return { value: tagStr, label: tagStr };
    })}
    onChange={this.setTagsValue.bind(this)}
    />
        </div>
        <div className='field'>
          {/* gets filled by select2 */}
          <input
          name="task[tag_list][]"
          type="text"
          value=''
          />
          <select
          className="tag_select" multiple="multiple" style={{width: '100%'}}
          name="tag_list[]" id="task_tag_list"
          value={this.state.task.tag_list}
          ref={(tagSelect) => { this.tagSelect = tagSelect; }}
          >
            {['cool', 'test', 'home'].map(function(tagStr, key) {
              return <option key={key} value={tagStr}>{tagStr}</option>;
            })
            }
          </select>
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

