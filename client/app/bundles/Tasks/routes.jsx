import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import TaskFocus from './components/TaskFocus';
import Main from './components/Main';
import NextTask from './components/TaskFocus';
import TaskList from './components/TaskList';


export default class routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Main}>
          <IndexRoute component={NextTask} />
          <Route path='/tasks' component={TaskList} />
          <Route path='/tasks/:taskId' component={TaskFocus} />
        </Route>
      </Router>
    );
  }
}

