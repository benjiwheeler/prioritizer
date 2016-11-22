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

export function deleteTask(taskId) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: tasksOrdered.filter(task => task.id !== taskId)
  });
  var rh = new RequestHelper();
  return rh.delete(window.globalAppInfo.host + "/tasks/" + taskId + ".json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
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
    // debugger;
    fetchTaskLists();
  });
}

export function postponeTask(taskId) {
  // move this task to the rear
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  const task = tasksOrdered.find(task => task.id === taskId);
  if (task !== undefined) {
    TaskStore.setState({
      tasksOrdered: [...tasksOrdered.filter(task => task.id !== taskId), task]
    });
  }

  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/postpone.json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function workedTask(taskId) {
  // move this task to the rear
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  const task = tasksOrdered.find(task => task.id === taskId);
  if (task !== undefined) {
    TaskStore.setState({
      tasksOrdered: [...tasksOrdered.filter(task => task.id !== taskId), task]
    });
  }

  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/worked.json")
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}

export function submitNewTask(newTask) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: [...tasksOrdered, newTask]
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks.json", {task: newTask})
  .then(function(jsonData) {
    // debugger;
    fetchTaskLists();
  });
}
