import TaskStore from './store/TaskStore.js';
import RequestHelper from '../../../lib/RequestHelper';

export function provideInitialState() {
  TaskStore.setState({
    tagsOrdered: [],
    tasksByTagOrdered: {},
    tasksById: {}
  });
}

var handleTasks = function(data) {
  var tasksById = {};
  for (let tagName in data.tags) {
    let tasksArr = data.tags[tagName];
    tasksArr.forEach((task) => {
      tasksById[task.id] = task;
    });
  }
  TaskStore.setState({
    tasksByTagOrdered: data.tags, // includes "all" tag
    tasksById: tasksById
  });
};

// don't replace -- just take union of sets
var addTasks = function(data) {
  var tasksById = {};
  for (let tagName in data.tags) {
    let tasksArr = data.tags[tagName];
    tasksArr.forEach((task) => {
      tasksById[task.id] = task;
    });
  }
  dataByTags = Object.assign({}, TaskStore.state.tasksByTagOrdered, data.tags);
  TaskStore.setState({
    tasksByTagOrdered: data.tags, // includes "all" tag
    tasksById: tasksById
  });
};

var handleTags = function(data) {
  TaskStore.setState({
    tagsOrdered: data.tags
  });
};

export function fetchTags() {
  var rh = new RequestHelper();
  return rh.get(window.globalAppInfo.host + "/users/" + window.globalAppInfo.user_id + "/tags.json")
  .then(function(response) {
    if (response.success) {
      handleTags(response.data);
    }
  });
}

// get info on all list of tasks by tag
export function fetchTaskLists(priority_tag_name) {
  if (typeof(priority_tag_name)==='undefined') {
    var rh = new RequestHelper();
    return rh.get(window.globalAppInfo.host + "/tasks/lists.json")
    .then(function(response) {
      // structure like:
      // data.tags == {'home': [{id:47,name:"..."},{...}], 'work': [...]}
      if (response.success) {
        handleTasks(response.data);
      }
    });
  } else {
    var rh = new RequestHelper();
    return rh.get(window.globalAppInfo.host + "/tasks/list.json", {tag: priority_tag_name})
    .then(function(response) {
      // structure like:
      // data.tags == {'home': [{id:47,name:"..."},{...}], 'work': [...]}
      if (response.success) {
        handleTasks(response.data);
        var rh = new RequestHelper();
        return rh.get(window.globalAppInfo.host + "/tasks/lists.json", {except_tag: priority_tag_name})
        .then(function(response) {
          // structure like:
          // data.tags == {'home': [{id:47,name:"..."},{...}], 'work': [...]}
          if (response.success) {
            addTasks(response.data);
          }
        });
      }
    });
  }
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

// must square this task's (possibly) new content AND tags with which tags
// this task is stored under, and what's stored there!
var tasksWithTaskUpdated = function(taskToUpdate) {
  let { tasksByTagOrdered } = TaskStore.getData(["tasksByTagOrdered"]);
  Object.keys(tasksByTagOrdered).forEach(function (tagName) {
    const taskHasThisTag = taskToUpdate.tags.some(tag => tag.name === tagName);
    const existingTaskIndex = tasksByTagOrdered[tagName].findIndex(task => task.id === taskToUpdate.id);
    if (taskHasThisTag) {
      if (existingTaskIndex >= 0) { // it's here and belongs here
        tasksByTagOrdered[tagName][existingTaskIndex] = taskToUpdate;
      } else { // should be here, but it's not
        tasksByTagOrdered[tagName].push(taskToUpdate);
      }
    } else { // task doens't belong here
      if (existingTaskIndex >= 0) { // but it is here, so remove it
        tasksByTagOrdered[tagName] =
          [...tasksByTagOrdered[tagName].filter(task => task.id !== taskToUpdate.id)];
      } // else it's not here, so we're good
    }
  });
  return tasksByTagOrdered;
};

export function deleteTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskRemoved(taskId)
  });
  var rh = new RequestHelper();
  return rh.delete(window.globalAppInfo.host + "/tasks/" + taskId + ".json")
  .then(function(response) {
    // debugger;
    fetchTaskLists();
    return (response);
  });
}

export function finishTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskRemoved(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/done.json")
  .then(function(response) {
    // debugger;
    fetchTaskLists();
    return (response);
  });
}

export function updateTask(taskToUpdate) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskUpdated(taskToUpdate)
  });
  var rh = new RequestHelper();
  return rh.put(window.globalAppInfo.host + "/tasks/" + taskToUpdate.id + ".json",
    {task: taskToUpdate})
  .then(function(response) {
    fetchTaskLists();
    fetchTags(); // might have added or deleted a tag!
    return (response);
  });
}

export function postponeTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskMovedToEnd(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/postpone.json")
  .then(function(response) {
    // debugger;
    fetchTaskLists();
    return (response);
  });
}

export function workedTask(taskId) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskMovedToEnd(taskId)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks/" + taskId + "/worked.json")
  .then(function(response) {
    // debugger;
    fetchTaskLists();
    return (response);
  });
}

export function submitNewTask(newTask) {
  TaskStore.setState({
    tasksByTagOrdered: tasksWithTaskAdded(newTask)
  });
  var rh = new RequestHelper();
  return rh.post(window.globalAppInfo.host + "/tasks.json", {task: newTask})
  .then(function(response) {
    // debugger;
    fetchTaskLists();
    fetchTags(); // might have added a tag!
    return (response);
  });
}
