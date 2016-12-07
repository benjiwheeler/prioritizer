import React, { PropTypes } from 'react';
import Component from 'react';
import FlipMove from 'react-flip-move';
import TaskStore from '../store/TaskStore.js';
import {deleteTask, finishTask, updateTask} from '../TaskActions';
import { Link } from 'react-router';
import { NavBar } from './NavBar.jsx';
import { IconShortcutLink } from './Main';
import { CircleCell } from './CircleCell';

export class TaskListable extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      rowClass: "",
      task: props.task
    };
  }

  attemptDelete(e) {
    e.preventDefault();
    var retVal = confirm("Sure?");
    if (retVal === true) {
      // this.setState({
      //   rowClass: "doDelete"
      // });
      setTimeout(function() {
        deleteTask(this.state.task.id);
      }.bind(this), 1000);
    }
  }

  markFinished(e) {
    e.preventDefault();
    // this.setState({
    //   rowClass: "doComplete"
    // });
    setTimeout(function() {
      finishTask(this.state.task.id);
    }.bind(this), 1000);
  }

  handleCircleChange(kind, newVal) {
    if (kind in this.state.task) {
      var task = this.state.task;
      newVal = Math.round(newVal * 10) / 10;
      task[kind] = newVal;
      updateTask(task);
      this.setState({
        task: task
      });
    }
  }

  render() {
    return (
      <div className={this.state.rowClass}>
      <div className="rowWithoutIndent">
        <div className="taskTableCellText">
          <div className="break-text" style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.5rem', paddingBottom: '.6rem', verticalAlign: 'middle', lineHeight: '1em', width: '100%'}}>
            <Link to={{pathname: `/tasks/${this.state.task.id}`, query: {tagName: this.props.tagName, nextPagePath: '/tasks', nextPageText: 'Task list'}}}>
              { this.state.task.name }
            </Link>
          </div>
        </div>
        <div className="taskTableCellSmall">
          <CircleCell size={Number(this.state.task.vital)} onChange={this.handleCircleChange.bind(this, "vital")} color="#09bc36" />
        </div>
        <div className="taskTableCellSmall">
          <CircleCell size={Number(this.state.task.immediate)} onChange={this.handleCircleChange.bind(this, "immediate")} color="#f9d507" />
        </div>
        <div className="taskTableCellSmall">
          <CircleCell size={Number(this.state.task.heavy)} onChange={this.handleCircleChange.bind(this, "heavy")} color="#ed1409" />
        </div>
        <div className="taskTableCellSmall">
          <CircleCell size={Number(this.state.task.long)} onChange={this.handleCircleChange.bind(this, "long")} color="#1061e5" />
        </div>
        <div className="taskTableCellSmall">
          <Link to={{pathname: `/tasks/${this.state.task.id}`, query: {tagName: this.props.tagName}}}
          className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-play-circle"></i>
            </div>
          </Link>
        </div>
        <div className="taskTableCellSmall">
          <a href="" className="list-action-link" onClick={this.attemptDelete.bind(this)}>
            <div className="list-action-logo">
              <i className="fa fa-times"></i>
            </div>
          </a>
        </div>
        <div className="taskTableCellSmall">
          <Link to={{pathname: `/tasks/${this.state.task.id}/edit`, query: {tagName: this.props.tagName,  nextPagePath: '/tasks', nextPageText: 'Task list'}}}
          className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-pencil"></i>
            </div>
          </Link>
        </div>
        <div className="taskTableCellSmall">
          <a href="" className="list-action-link" onClick={this.markFinished.bind(this)}>
            <div className="list-action-logo">
              <i className="fa fa-check"></i>
            </div>
          </a>
        </div>
      </div>
      </div>
    );
  }
}
TaskListable.contextTypes = { // if you want to use this.context, you must define contextTypes
  router: React.PropTypes.object
};
TaskListable.propTypes = {
  task: React.PropTypes.object.isRequired,
  tagName: React.PropTypes.string
};


export class TaskListMasterControls extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      tagName: props.tagName
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.tagName !== undefined && newProps.tagName !== null) {
      this.setState({
        tagName: window.globalAppInfo.tagNameOrAll(newProps.tagName)
      });
    }
  }


  render() {
    return (
      <div>
        <IconShortcutLink text='Begin' id="begin_link"
        to={{pathname: '/tasks/next', query: {tagName: this.state.tagName, nextPagePath: '/tasks', nextPageText: 'Task list'}}}
        faIconClass='fa-play-circle' />
        <IconShortcutLink text='New Task' id="new_task_link"
        to={{pathname: '/tasks/new', query: {tagName: this.state.tagName, nextPagePath: '/tasks', nextPageText: 'Task list'}}}
        faIconClass='fa-lightbulb-o' />
      </div>
    );
  }
}

export class TaskList extends React.Component {

  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksByTagOrdered"]),
      tagName: window.globalAppInfo.tagNameOrAll(props.location.query.tagName)
    };
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksByTagOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tagName: window.globalAppInfo.tagNameOrAll(newProps.location.query.tagName)
    });
  }

  render() {
    let tasksByTagOrdered = this.state.tasksByTagOrdered;
    let tagName = this.state.tagName;
    let allTasksJsx = (<div></div>);
    if (tasksByTagOrdered !== undefined && tasksByTagOrdered !== null &&
      tasksByTagOrdered[tagName] !== undefined && tasksByTagOrdered[tagName] !== null) {
    //   console.log("tasksByTagOrdered[" + tagName + "]");
    // console.log(tasksByTagOrdered[tagName]);
      allTasksJsx = tasksByTagOrdered[tagName].map((task) => (
        <TaskListable key={task.id + "hello1"} task={task} tagName={tagName}/>
      ));
    }

    return (
      <div>
        <NavBar tagName={this.state.tagName} to='/tasks' showBack={false}/>
        <TaskListMasterControls tagName={this.state.tagName} />
        <table className="table" style={{marginTop: '6rem'}}>
          <thead>
            <tr>
              <th className="list-header-text" style={{width: '5%', minWidth: '20px', float: 'left', position: 'relative', minHeight: '1px', paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Task</th>
              <th style={{border: 'none', width: '43%', float: 'left', position: 'relative', minHeight: '1px', paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}></th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Vital</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Imm.</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Heavy</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Long</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Start</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Del.</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Edit</th>
              <th className="list-header-text taskTableCellSmall" style={{paddingTop: '.3rem', paddingBottom: '.1rem', verticalAlign: 'top'}}>Done</th>
            </tr>
          </thead>
        </table>

        <FlipMove
         easing="cubic-bezier(0.7, 0.0, 0.4, 1.0)"
         staggerDurationBy="10"
         enterAnimation="fade"
         leaveAnimation="fade"
         maintainContainerHeight={true}>
          { allTasksJsx }
        </FlipMove>

      </div>
    );
  }
}
TaskList.propTypes = {
  tagName: React.PropTypes.string
};
