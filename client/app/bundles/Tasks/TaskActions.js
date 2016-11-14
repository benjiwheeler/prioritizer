import TaskStore from './store/TaskStore.js';

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
}
