var React = require('react');
var ReactDOM = require('react-dom');
import ReactOnRails from 'react-on-rails';
var routes = require('./routes');

const TasksApp = (props) => (
  routes
);

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TasksApp });
