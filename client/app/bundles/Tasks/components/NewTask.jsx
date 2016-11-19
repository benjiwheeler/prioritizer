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
      <div>
      slider {this.state.kind}
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

  handleSubmit(e) {
    e.preventDefault();
    submitNewTask(this.state.newTask);
  }

  setValue(field, event) {
    debugger; // what does tag field show???
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
      <option selected="selected" value="cool">cool</option>
    );

    return (
      <div>
      <form className="new_task" id="new_task" accept-charset="UTF-8"
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
          <select className="tag_select" multiple="multiple" style="width: 100%"
          name="task[tag_list][]" id="task_tag_list" onChange={this.setValue.bind(this, "task[tag_list][]")}>
            {tagOptions}
          </select>
        </div>

        <Slider kind="vital" onChange={this.setValue.bind(this, "task[vital]")} />
        <Slider kind="immediate" />

        <div className='actions'>
          <input type="submit" name="commit" value="Save"/>
        </div>
      </form>
      </div>
    );
  }
}

