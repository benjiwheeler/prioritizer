import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, fetchTags, fetchTaskLists} from '../TaskActions';
import { Link } from 'react-router';
import { NavBar } from './NavBar.jsx';

export class IconShortcutLink extends React.Component {
  render() {
    return(
      <Link to={this.props.to} id={this.props.id} className="action-link" rel="nofollow"
      data-method="post" href="" onClick={this.props.onClick}>
        <div className='action-logo'>
          <i className={'fa ' + this.props.faIconClass}></i>
        </div>
        <div className='shortcut-link'>{this.props.text}</div>
      </Link>
    );
  }
}

export class Alert extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      level: props.level,
      text: props.text,
      visible: false
    };
  }

  componentDidMount() {
    window.globalAppInfo.alertComponent = this;
  }

  show(newProps) {
    this.setState({
      ...newProps
    });
    if (this.state.visible === false) {
      this.setState({
        visible: 'fadeIn'
      });
      setTimeout(this.finishFadeIn.bind(this), 500);
    }
  }

  finishFadeIn() {
    this.setState({
      visible: true
    });
    setTimeout(this.fadeOut.bind(this), 3000);
  }

  fadeOut() {
    this.setState({
      visible: 'fadeOut'
    });
    setTimeout(this.hide.bind(this), 500);
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  alertClass() {
    switch (this.state.level) {
    case "danger":
      return 'alert-danger';
    case "success":
      return 'alert-success';
    default:
      return 'alert-success';
    }
  }

  glyphClass() {
    switch (this.state.level) {
    case "danger":
      return 'glyphicon-exclamation-sign';
    case "success":
      return 'glyphicon-ok';
    default:
      return 'glyphicon-ok';
    }
  }

  render() {
    let visibilityClass = '';
    if (this.state.visible === 'fadeOut') {
      visibilityClass = 'fade';
    } else if (this.state.visible === 'fadeIn') {
      visibilityClass = 'fadein';
    }
    return (
      <div style={{
        textAlign: 'center',
        width: '100%',
        position: 'fixed',
        opacity: 0.75,
        top: '2rem',
        left: 0
      }}>
        <div className={
          "alert " + this.alertClass() + " " + visibilityClass
        } style={{
          position: 'relative',
          visibility: (this.state.visible ? 'visible' : 'hidden'),
          width: '50%',
          minWidth: '300px',
          margin: '0 auto'
        }} role="alert">
          <span className={"glyphicon " + this.glyphClass()} aria-hidden="true"></span>
          &nbsp;{this.state.text}
        </div>
      </div>
    );
  }
}

export class Main extends React.Component {
  constructor(props) { // list of objects
    super(props);
  }

  componentWillMount() { // called by React.Component
    debugger;
    provideInitialState();
    fetchTaskLists(this.props.location.query.tagName);
    fetchTags();
  }

  render() {
    return (
      <div>
        <Alert level="success" text="success!" />
        {this.props.children}
      </div>
    );
  }
}
Main.propTypes = {
  tagName: React.PropTypes.string
};

