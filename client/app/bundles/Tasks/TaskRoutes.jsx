import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { TaskFocus } from './components/TaskFocus';
import { Main } from './components/Main';
import { NextTask } from './components/TaskFocus';
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
        <Route path='tasks' component={Main}>
          <IndexRoute component={TaskList} />
          <Route path='next' component={NextTask} />
          <Route path=':taskId' component={TaskFocus} />
        </Route>
      </Router>
      </div>
    );
  }
}

