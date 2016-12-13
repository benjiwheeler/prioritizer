import React from 'react';
import ReactDOM from 'react-dom';
import ReactOnRails from 'react-on-rails';
import TaskRoutes from './TaskRoutes';
import { browserHistory } from 'react-router';

window.globalAppInfo = {
   host: "",
   // host: "http://localhost:5000",
  // host: "https://prioritizershake.herokuapp.com",
  tagNameOrAll: function(tagNameParam) {
    let tagName = tagNameParam;
    if (tagName === undefined || tagName === null) {
      tagName = "all";
    }
    return tagName;
  },

  idleMinsUntilReload: 1,

  idleMinsUntilReload: 1,

  lastActionTime: null,

  refreshLastActionTime: function() {
    this.lastActionTime = new Date();
  }

};

function keepAlive() {
  let secsPassed = (new Date()) - window.globalAppInfo.lastActionTime;
  let minsPassed = secsPassed / 60000;
  if (minsPassed >  1)
    window.location.reload(true);
  } else {
    setTimeout(this.keepAlive.bind(this), 10000);
  }
  window.globalAppInfo.refreshLastActionTime()
}

// confirmed that this is called when i expect it to: on every route change
browserHistory.listen( location =>  {
  if (window.globalAppInfo.lastActionTime !== null) {
    alert("last action had been: " + window.globalAppInfo.lastActionTime.getHours() + ":" + window.globalAppInfo.lastActionTime.getMinutes());
  }
  window.globalAppInfo.refreshLastActionTime();
  alert("last action now: " + window.globalAppInfo.lastActionTime.getHours() + ":" + window.globalAppInfo.lastActionTime.getMinutes());
  let minsPassed = window.globalAppInfo.minsPassedSinceLastAction();
  if (minsPassed > window.globalAppInfo.idleMinsUntilReload) {
    window.location.reload(true);
  } else {
    setTimeout(ckeckKeepAlive, 10000);
  }
});

const TasksApp = (props) => (
  React.createElement(TaskRoutes, props)
);

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TasksApp });
