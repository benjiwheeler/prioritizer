import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { TaskFocus } from './components/TaskFocus';
import { Main } from './components/Main';
import { NextTask } from './components/NextTask';
import { TaskList } from './components/TaskList';

export default class routes extends Component {
  constructor(props) { // called by React.Component
    super(props);
    window.globalAppInfo = {
      ...window.globalAppInfo,
      ...props
    };
  }

  render() {
    return (
      <div>APP HERE
      <Router history={hashHistory}>
        <Route path='/' component={Main}>
          <Route path='tasks'>
            <IndexRoute component={TaskList} />
            <Route path='next' component={NextTask} />
            <Route path='new' component={NewTask} />
            <Route path=':taskId' component={TaskFocus} />
          </Route>
        </Route>
      </Router>
      </div>
    );
  }
}

