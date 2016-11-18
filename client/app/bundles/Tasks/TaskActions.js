import TaskStore from './store/TaskStore.js';
import RequestHelper from '../../../lib/RequestHelper';

export function provideInitialState() {
  TaskStore.setState({
    tagsOrdered: [],
    tasksOrdered: [],
    tasksById: {}
  });
}

var handleTasks = function(info) {
  var tasksById = {};
  info.data.tasks.forEach((task) => {
    tasksById[task.id] = task;
  });
  TaskStore.setState({
    tasksOrdered: info.data.tasks,
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


export function fetchTasks() {
  var rh = new RequestHelper();
  return rh.get(window.globalAppInfo.host + "/tasks.json")
  .then(function(jsonData) {
    handleTasks(jsonData);
  });
}

export function deleteTask(taskId) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: tasksOrdered.filter(task => task.id !== taskId)
  });
  var rh = new RequestHelper();
  return rh.delete(window.globalAppInfo.host + "/tasks/" + taskId + ".json")
  .then(function(jsonData) {
    debugger;
    fetchTasks();
  });
}

export function finishTask(taskId) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: tasksOrdered.filter(task => task.id !== taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/done.json")
  .then(function(jsonData) {
    debugger;
    fetchTasks();
  });
}

export function submitNewTask(newTask) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: [...tasksOrdered, newTask]
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks.json")
  .then(function(jsonData) {
    debugger;
    fetchTasks();
  });
}
