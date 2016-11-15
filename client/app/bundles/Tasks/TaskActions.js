import TaskStore from './store/TaskStore.js';
import axios from 'axios';

export function provideInitialState() {
  TaskStore.setState({
    tasksOrdered: [],
    tasksById: {}
  });
}


export function requestToServer() {
  return axios({
    url: "http://localhost:5000/tasks.json",
//    url: "https://prioritizershake.herokuapp.com/tasks.json",
    timeout: 20000,
    method: 'get',
    responseType: 'json'
  }).then(function(info) {
    var tasksById = {};
    info.data.tasks.forEach((task) => {
      tasksById[task.id] = task;
    });
    TaskStore.setState({
      tasksOrdered: info.data.tasks,
      tasksById: tasksById
    });
  });

}

export function deleteTask(taskId) {
  const curOrdered = TaskStore.getData(["tasksOrdered"]);
  TaskStore.setState({
    tasksOrdered: curOrdered.filter(task => task.id !== taskId)
  });
}
