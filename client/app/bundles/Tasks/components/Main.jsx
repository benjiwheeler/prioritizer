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

export class Main extends React.Component {
  componentWillMount() { // called by React.Component
    provideInitialState();
    fetchTaskLists();
    fetchTags();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

