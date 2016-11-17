import React from 'react';
import ReactDOM from 'react-dom';
import ReactOnRails from 'react-on-rails';
import TaskRoutes from './TaskRoutes';

const TasksApp = (props) => (
  React.createElement(TaskRoutes, props)
);

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TasksApp });
