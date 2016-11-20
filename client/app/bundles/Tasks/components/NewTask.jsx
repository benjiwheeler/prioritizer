import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {submitNewTask} from '../TaskActions';

export class Slider extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      kind: props.kind
    };
  }

  render() {
    return (
      <div className='row' style={{marginTop: '5px'}}>
        <div className='col-xs-3'>
          <div style={{paddingLeft: '5px'}}>
            <i className='icon-down-right-arrow'
            style={{float: 'left', position: 'relative'}}></i>
            <label htmlFor={'task_' + this.props.kind}>{this.props.text}</label>
            <span id={this.props.kind + '_slider_amount_shown'}
            style={{border: 0, color: '#f6931f', fontWeight: 'bold'}}></span>
            <input id='vital_slider_amount_hidden' name='task[vital]'
            type='hidden' value='' onChange={this.props.onSliderChange}/>
          </div>
        </div>
        <div className='field col-xs-9'>
          <div className='imp_slider' id='vital_slider'
          style={{marginTop: '3px'}}></div>
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
      newTask: {}
    };
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

  handleSubmit(e) {
    e.preventDefault();
    submitNewTask(this.state.newTask);
  }

  handleSliderChange(kind, e) {
    debugger; // what does tag field show???
    const newTask = this.state.newTask;
    newTask['kind'] = e.target.value;
    this.setState({
      newTask: newTask
    });
  }

  setValue(field, event) {
    var newTask = this.state.newTask;
    newTask[field] = event.target.value;
    this.setState({
      newTask: newTask
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
    let tagOptions = (
      <option value="cool">cool</option>
    );

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
          name="task[name]"
          id="task_name"
          value={this.state.newTask["task[name]"]}
          onChange={this.setValue.bind(this, "task[name]")}
          />
        </div>
        <div className='field'>
          {/* gets filled by select2 */}
          <input
          name="task[tag_list][]"
          type="hidden"
          value=""
          />
          <select
          className="tag_select" multiple="multiple" style={{width: '100%'}}
          name="task[tag_list][]" id="task_tag_list"
          value={[]}
          onChange={this.setValue.bind(this, "task[tag_list][]")}>
            {tagOptions}
          </select>
        </div>

        <Slider kind="vital" text="Vital" onSliderChange={this.handleSliderChange.bind(this, 'vital')} />
        <Slider kind="immediate" text="Immediate" />

        <div className='actions'>
          <input type="submit" name="commit" value="Save"/>
        </div>
      </form>
      </div>
    );
  }
}

