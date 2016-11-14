import TaskStore from './store/TaskStore.js';
import axios from 'axios';

export function provideInitialState() {
  TaskStore.setState({
      tasks: [
        {name: "task1"},
        {name: "task2"},
        {name: "task3"}
      ]
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
    console.log(info);
    TaskStore.setState({tasks: info.data.tasks});
  });

}
