import TaskStore from './store/TaskStore.js';
import RequestHelper from '../../../lib/RequestHelper';

export function provideInitialState() {
  TaskStore.setState({
    tagsOrdered: [],
    tasksByTagOrdered: {},
    tasksById: {}
  });
}

var handleTasks = function(info) {
  var tasksById = {};
  for (let tagName in info.data.tags) {
    let tasksArr = info.data.tags[tagName];
    tasksArr.forEach((task) => {
      tasksById[task.id] = task;
    });
  }
  TaskStore.setState({
    tasksByTagOrdered: info.data.tags, // includes "all" tag
    tasksById: tasksById
  });
};

var handleTags = function(info) {
  TaskStore.setState({
    tagsOrdered: info.data.tags
  });
};

export function fetchTags() {
  var rh = new RequestHelper();
  return rh.get(window.globalAppInfo.host + "/users/" + window.globalAppInfo.user_id + "/tags.json")
  .then(function(jsonData) {
    handleTags(jsonData);
  });
}

// get info on all list of tasks by tag
export function fetchTaskLists() {
  var rh = new RequestHelper();
  return rh.get(window.globalAppInfo.host + "/tasks/lists.json")
  .then(function(jsonData) {
    // structure like:
    // info.data.tags == {'home': [{id:47,name:"..."},{...}], 'work': [...]}
    handleTasks(jsonData);
  });
}

var tasksWithTaskAdded = function(newTask) {
  let { tasksByTagOrdered } = TaskStore.getData(["tasksByTagOrdered"]);
  newTask.tag_list.forEach(function (tagName) {
    if (tagName in tasksByTagOrdered) {
      tasksByTagOrdered[tagName] = [...tasksByTagOrdered[tagName], newTask];
    } else {
      tasksByTagOrdered[tagName] = [newTask];
    }
  });
  return tasksByTagOrdered;
};

var tasksWithTaskRemoved = function(taskId) {
  let { tasksByTagOrdered } = TaskStore.getData(["tasksByTagOrdered"]);
  Object.keys(tasksByTagOrdered).forEach(function (tagName) {
    tasksByTagOrdered[tagName] =
      tasksByTagOrdered[tagName].filter(task => task.id !== taskId);
  });
  return tasksByTagOrdered;
};

var tasksWithTaskMovedToEnd = function(taskId) {
  let { tasksByTagOrdered } = TaskStore.getData(["tasksByTagOrdered"]);
  Object.keys(tasksByTagOrdered).forEach(function (tagName) {
    const task = tasksByTagOrdered[tagName].find(task => task.id === taskId);
    tasksByTagOrdered[tagName] =
      [...tasksByTagOrdered[tagName].filter(task => task.id !== taskId), task];
  });
  return tasksByTagOrdered;
};

export function deleteTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskRemoved(taskId)
  });
  var rh = new RequestHelper();
  return rh.delete(window.globalAppInfo.host + "/tasks/" + taskId + ".json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function finishTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskRemoved(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/done.json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function postponeTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskMovedToEnd(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/postpone.json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function workedTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskMovedToEnd(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/worked.json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function submitNewTask(newTask) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskAdded(newTask)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks.json", {task: newTask})
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}
