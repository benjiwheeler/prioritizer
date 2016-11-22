import React, { PropTypes } from 'react';
import Component from 'react';
import TaskStore from '../store/TaskStore.js';
import {deleteTask, finishTask} from '../TaskActions';
import { Link } from 'react-router';
import { NavBar } from './NavBar.jsx';

export class CircleCell extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      color: props.color,
      ...this.calcSize(props.size)
    };
  }


  calcSize(size) {
    var smallest_size = 3;
    var scale_factor = 1.5;
    if (size === undefined || size === null) {
      size = 1;
    }
    size = scale_factor * (size + smallest_size)/(10.0 + smallest_size);
    var spacer_size = scale_factor * smallest_size/(10.0 + smallest_size);
    spacer_size -= size / 2.0;
    spacer_size += 0.2; // extra spacing
    return {
      size: size,
      spacer_size: spacer_size
    };
  }

  setSize(size) {
    this.setState({
      ...this.calcSize(size)
    });
  }

  toggleResize(e) {
    e.preventDefault();
    this.setSize(5);
  }

  render() {
    return (
      <td onClick={this.toggleResize.bind(this)} style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.7rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
        <div className="circle" style={{backgroundColor: this.state.color, width: this.state.size + 'em', height: this.state.size + 'em', marginLeft: this.state.spacer_size + 'em', marginTop: (this.state.spacer_size + 0.5) + 'em'}}></div>
      </td>
    );
  }
}
CircleCell.propTypes = {
  size: React.PropTypes.number,
  color: React.PropTypes.string
};


export class TaskListable extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      rowClass: "",
    };
  }

  attemptDelete(e) {
    e.preventDefault();
    var retVal = confirm("Sure?");
    if (retVal === true) {
      this.setState({
        rowClass: "doDelete"
      });
      setTimeout(function() {
        deleteTask(this.props.task.id);
      }.bind(this), 1000);
    }
  }

  markFinished(e) {
    e.preventDefault();
    this.setState({
      rowClass: "doComplete"
    });
    setTimeout(function() {
      finishTask(this.props.task.id);
    }.bind(this), 1000);
  }

  render() {
    return (
      <tr className={this.state.rowClass}>
        <td className="break-text" style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.5rem', paddingBottom: '.6rem', verticalAlign: 'middle', lineHeight: '1em', width: '100%'}}>
          <Link to={{pathname: `/tasks/${this.props.task.id}`, query: {tagName: this.props.tagName}}}>
            { this.props.task.name } { this.state.rowClass }
          </Link>
        </td>
        <CircleCell size={Number(this.props.task.vital)} color="#09bc36" />
        <CircleCell size={Number(this.props.task.immediate)} color="#f9d507" />
        <CircleCell size={Number(this.props.task.heavy)} color="#ed1409" />
        <CircleCell size={Number(this.props.task.long)} color="#1061e5" />
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-play-circle"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link" onClick={this.attemptDelete.bind(this)}>
            <div className="list-action-logo">
              <i className="fa fa-times"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link">
            <div className="list-action-logo">
              <i className="fa fa-check"></i>
            </div>
          </a>
        </td>
        <td style={{paddingLeft: '.1rem', paddingRight: '.1rem', paddingTop: '.3rem', paddingBottom: '.5rem', verticalAlign: 'top'}}>
          <a href="" className="list-action-link" onClick={this.markFinished.bind(this)}>
            <div className="list-action-logo">
              <i className="fa fa-check"></i>
            </div>
          </a>
        </td>
      </tr>
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
    };
  }

  render() {
    return (
      <div>
        <Link to={'/tasks/next'} className='action-link'>
          <div className='action-logo'>
            <i className="fa fa-play-circle"></i>
          </div>
          <div className='shortcut-link'>Start</div>
        </Link>
        <Link to={'/tasks/new'} className='action-link'>
          <div className='action-logo'>
            <i className="fa fa-lightbulb-o"></i>
          </div>
          <div className='shortcut-link'>New Task</div>
        </Link>
      </div>
    );
  }
}

export class TaskList extends React.Component {

  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tasksByTagOrdered"]),
      tagName: window.globalAppInfo.tagNameOrAll(props.params.tagName)
    };
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tasksByTagOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
        debugger;
    if (this.state.taskId !== this.getTaskIdFromProps(newProps)) {
      this.setState({
        tagName: window.globalAppInfo.tagNameOrAll(newProps.tagName)
      });
    }
  }

  render() {
    let tasksByTagOrdered = this.state.tasksByTagOrdered;
    let tagName = this.state.tagName;
    let allTasksJsx = (<tr></tr>);
    if (tasksByTagOrdered !== undefined && tasksByTagOrdered !== null &&
      tasksByTagOrdered[tagName] !== undefined && tasksByTagOrdered[tagName] !== null) {
      allTasksJsx = tasksByTagOrdered[tagName].map((task) => (
        <TaskListable key={task.id} task={task} tagName={tagName}/>
      ));
    }

    return (
      <div>
        <NavBar tagName={this.props.params.tagName} to='/tasks' showBack={false}/>
        <TaskListMasterControls />
        <table className="table" style={{marginTop: '6rem'}}>
          <thead>
            <tr>
              <th className="col-xs-4 col-md-4 list-header-text">Task</th>
              <th className="col-xs-1 col-md-1 list-header-text">Vital</th>
              <th className="col-xs-1 col-md-1 list-header-text">Imm.</th>
              <th className="col-xs-1 col-md-1 list-header-text">Heavy</th>
              <th className="col-xs-1 col-md-1 list-header-text">Long</th>
              <th className="col-xs-1 col-md-1 list-header-text">Start</th>
              <th className="col-xs-1 col-md-1 list-header-text">Del.</th>
              <th className="col-xs-1 col-md-1 list-header-text">Edit</th>
              <th className="col-xs-1 col-md-1 list-header-text">Done</th>
            </tr>
          </thead>
          <tbody>
            { allTasksJsx }
          </tbody>
        </table>
      </div>
    );
  }
}
TaskList.propTypes = {
  tagName: React.PropTypes.string
};
TaskList.contextTypes = { // if you want to use this.context, you must define contextTypes
  router: React.PropTypes.object
};
