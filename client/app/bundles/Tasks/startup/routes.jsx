var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var TaskList = require('../components/TaskList');

var routes = (
  <Router>
    <Route path='/' component={TaskList} />
  </Router>
);

module.export = routes;

