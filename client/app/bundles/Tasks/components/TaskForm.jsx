import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import { fetchTags} from '../TaskActions';
import Select, { Creatable } from 'react-select';
import { Slider } from './Slider';
import { ReactDOM } from 'react-dom';


export class TaskForm extends React.Component {
  constructor(props) { // list of objects
    super(props);
    fetchTags();
    this.onSubmit = props.onSubmit;
    this.state = {
      ...TaskStore.getData(["tagsOrdered"]),
      task: props.task,
      tagName: props.tagName
    };
    // match the format react-select will provide
    this.state.react_select_tag_list = props.task.tags.map(function(tag) {
      return {label: tag.name, value: tag.name};
    });
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
    if (newProps.tagName !== this.state.tagName) {
      this.setState({
        tagName: newProps.tagName
      });
    } else if (newProps.tagName === undefined || newProps.tagName === null
      || newProps.tagName === "all") {
      // no tag provided; set to default...
      // (as long as there is some default!)
      if (newProps.tagsOrdered !== undefined && newProps.tagsOrdered !== null &&
        newProps.tagsOrdered.length > 0) {

      }
    }

    if (newProps.onSubmit !== undefined || newProps.onSubmit !== null) {
      this.onSubmit = newProps.onSubmit;
    }
  }

  componentDidMount() {
    this.nameInput.focus();
    this.nameInput.value = "";
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

  handleSubmit(e) {
    e.preventDefault();
    this.mapReactTags();
    this.onSubmit(this.state.task);
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

  toggleCheckbox(field, event) {
    let curValue = this.state.task[field];
    let newValue = false;
    if (curValue === "on" || curValue === true) {
      newValue = false;
    } else {
      newValue = true;
    }
    this.setFieldValue(field, newValue);
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
              ref={(input) => { this.nameInput = input; }}
              value={this.state.task.name}
              onChange={this.setEventValue.bind(this, "name")}
            />
          </div>
          <div className='field'>
            {/* menuContainerStyle is per https://github.com/JedWatson/react-select/issues/1085 */}
            <Creatable
              multi={true}
              value={this.state.react_select_tag_list}

              onChange={this.setTagsValue.bind(this)}
              tabSelectsValue={false}
              menuContainerStyle={{ zIndex: 5 }}
              options={this.state.tagsOrdered.map(function(tagObj) {
                return { value: tagObj.name, label: tagObj.name };
              })}
            />
          </div>

          <Slider kind="vital" text="Vital" sliderValue={this.state.task.vital} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="immediate" text="Immediate" sliderValue={this.state.task.immediate} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="heavy" text="Heavy" sliderValue={this.state.task.heavy} onSliderChange={this.handleSliderChange.bind(this)} />
          <Slider kind="long" text="Long" sliderValue={this.state.task.long} onSliderChange={this.handleSliderChange.bind(this)} />

          <div className='col-xs-3'>Daily
          </div>
          <div className='field'>
            <input type="checkbox" checked={this.state.task.is_daily}
            onChange={this.toggleCheckbox.bind(this, "is_daily")}
            />
          </div>
          <div className='row' style={{marginTop: '5px'}}>
            <div className='col-xs-3'>
              <div id='form_notes_toggle_section'>
                <i className='fa fa-caret-right' id='form_notes_toggle_off' style={{display: 'inline-block'}} />
                <i className='fa fa-caret-down' id='form_notes_toggle_on' style={{display: 'none'}} />
                <label>Notes</label>
              </div>
            </div>
            <div className='col-xs-9'>
              <div id='form_notes' style={{display: 'none'}}>
                <textarea style={{width: "100%"}}>
                </textarea>
              </div>
            </div>
          </div>

          <div className='actions'>
            <input type="submit" name="commit" value="Save"/>
          </div>
        </form>
      </div>
    );
  }
}



// <div class='row' style='margin-top: 5px'>
// <div class='col-xs-3'>
// <div id='form_due_toggle_section'>
// <i class='fa fa-caret-right' id='form_due_toggle_off' style='display: inline-block'></i>
// <i class='fa fa-caret-down' id='form_due_toggle_on' style='display: none'></i>
// <label for="task_due">Due</label>
// </div>
// </div>
// <div class='col-xs-9'>
// <div id='form_due' style='display: none'>
// <input id="due_date_input" class="form-control" type="text" name="task[due]" />
// </div>
// </div>
// </div>
// <div class='row' style='margin-top: 5px'>
// <div class='col-xs-3'>
// <div id='form_time_of_day_toggle_section'>
// <i class='fa fa-caret-right' id='form_time_of_day_toggle_off' style='display: inline-block'></i>
// <i class='fa fa-caret-down' id='form_time_of_day_toggle_on' style='display: none'></i>
// <label for="task_time_of_day">Time of day</label>
// </div>
// </div>
// <div class='col-xs-9'>
// <div id='form_time_of_day' style='display: none'>
// <input id="time_of_day_input" class="form-control" value="09:00 AM" type="text" name="task[time_of_day]" />
// </div>
// </div>
// </div>
// <div class='row' style='margin-top: 5px'>
// <div class='col-xs-3'>
// <div id='form_children_toggle_section'>
// <i class='fa fa-caret-right' id='form_children_toggle_off' style='display: inline-block'></i>
// <i class='fa fa-caret-down' id='form_children_toggle_on' style='display: none'></i>
// <label for="task_children">Children</label>
// </div>
// </div>
