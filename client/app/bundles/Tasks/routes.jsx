import React, {Component} from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import TaskList from './components/TaskList';


export default class routes extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={TaskList} />
      </Router>
    )
  }
}

