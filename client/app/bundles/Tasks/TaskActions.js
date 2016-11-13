import TaskStore from 'store/TaskStore.js'

export function provideInitialState() {
  Store.setState({
      series: ["abc", "def"],
      showAddForm: false
  })
}

export function addMessage(message) {
  let messages = Store.state.series;
  let newMessages = [...messages, message];
  Store.setState({series: newMessages});
}

export function setShowAddForm(doShow) {
  Store.setState({showAddForm: doShow});
}

export function requestToServer() {
  $.ajax({
    url: "http://localhost:3000/abc"
  }).then(function(response) {
    debugger;
  });
}
