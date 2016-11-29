import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, IndexRedirect, hashHistory } from 'react-router';
import { TaskFocus } from './components/TaskFocus';
import { Main } from './components/Main';
import { NextTask } from './components/NextTask';
import { NewTask } from './components/NewTask';
import { EditTask } from './components/EditTask';
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
      <div>
      <Router history={hashHistory}>
        <Route path='/' component={Main}>
          <Route path='tasks'>
            <IndexRoute component={TaskList} />
            <Route path='next' component={NextTask} />
            <Route path='new' component={NewTask} />
            <Route path=':taskId'>
              <IndexRoute component={TaskFocus} />
              <Route path='edit' component={EditTask} />
            </Route>
          </Route>
          <IndexRedirect to="tasks" />
        </Route>
      </Router>
      </div>
    );
  }
}

