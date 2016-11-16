import TaskStore from './store/TaskStore.js';
import RequestHelper from '../../../lib/RequestHelper';


export function provideInitialState() {
  TaskStore.setState({
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

export function fetchTasks() {
//    url: "https://prioritizershake.herokuapp.com/tasks.json"
  var rh = new RequestHelper();
  return rh.get("http://localhost:5000/tasks.json")
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
  return rh.delete("http://localhost:5000/tasks/" + taskId + ".json")
  .then(function() {
    fetchTasks();
  });
}

export function finishTask(taskId) {
  const { tasksOrdered } = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: tasksOrdered.filter(task => task.id !== taskId)
  });
  var rh = new RequestHelper();
  return rh.post("http://localhost:5000/tasks/" + taskId + "/done.json")
  .then(function() {
    fetchTasks();
  });
}
