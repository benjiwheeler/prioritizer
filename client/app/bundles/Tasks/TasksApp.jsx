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

  idleMinsUntilReload: 10.0,

  lastActionTime: null,

  latestHeartbeatId: 0,

  heartbeat: function(thisHeartbeatId) {
    if (thisHeartbeatId == window.globalAppInfo.latestHeartbeatId) {
      console.log("heartbeat: " + thisHeartbeatId);
      if (!window.globalAppInfo.reloadIfIdleTooLong()) {
        setTimeout(window.globalAppInfo.heartbeat.bind(window, thisHeartbeatId), 5000);
      }
    }
  },

  refreshLastActionTime: function() {
    this.lastActionTime = new Date();
  },

  minsPassedSinceLastAction: function() {
    if (window.globalAppInfo.lastActionTime === null) {
      return 0.0;
    }
    let secsPassed = (new Date()) - window.globalAppInfo.lastActionTime;
    return (secsPassed / 60000.0);
  },

  reloadIfIdleTooLong: function() {
    let minsPassed = window.globalAppInfo.minsPassedSinceLastAction();
    console.log("checking minsPassed: " + minsPassed);
    if (minsPassed >  window.globalAppInfo.idleMinsUntilReload) {
      window.location.reload(true);
      return true;
    } else {
      return false;
    }
  }
};


// confirmed that this is called when i expect it to: on every route change
browserHistory.listen( location => {
  window.globalAppInfo.reloadIfIdleTooLong();
  window.globalAppInfo.refreshLastActionTime();
});

window.onload = function() {
  // confirmed it's called on mac chrome
  window.globalAppInfo.refreshLastActionTime();
  window.globalAppInfo.latestHeartbeatId++;
  setTimeout(window.globalAppInfo.heartbeat.bind(window, window.globalAppInfo.latestHeartbeatId), 5000);
};

window.onfocus = function() {
  console.log("focused!");
  window.globalAppInfo.latestHeartbeatId++;
  setTimeout(window.globalAppInfo.heartbeat.bind(window, window.globalAppInfo.latestHeartbeatId), 5000);
  window.globalAppInfo.reloadIfIdleTooLong();
  window.globalAppInfo.refreshLastActionTime();
};

window.onblur = function() {
  console.log("blurred!");
  // set latest heartbeat id to one that isn't being called back, to halt callbacks
  window.globalAppInfo.latestHeartbeatId++;
};

const TasksApp = (props) => (
  React.createElement(TaskRoutes, props)
);

// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TasksApp });
