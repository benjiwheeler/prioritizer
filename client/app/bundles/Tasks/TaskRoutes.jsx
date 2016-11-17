import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { TaskFocus } from './components/TaskFocus';
import { Main } from './components/Main';
import { NextTask } from './components/TaskFocus';
import { TaskList } from './components/TaskList';

window.globalAppInfo = {
testprop: "testval"

};

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
          <IndexRoute component={TaskList} />
          <Route path='/tasks' component={TaskList} />
          <Route path='/tasks/next' component={NextTask} />
          <Route path='/tasks/:taskId' component={TaskFocus} />
        </Route>
      </Router>
      </div>
    );
  }
}

