import React from 'react'
import ReactDOM from 'react-dom';
import ReactOnRails from 'react-on-rails';
import routes from './routes';

const TasksApp = (props) => (
  React.createElement(routes)
);

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TasksApp });
