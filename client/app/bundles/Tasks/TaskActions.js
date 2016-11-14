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
  return axios({
    url: url,
    timeout: 20000,
    method: 'get',
    responseType: 'json'
  })
  .then(function(response) {
    dispatch(receiveData(response.data));
  })
  .catch(function(response){
    dispatch(receiveError(response.data));
    dispatch(pushState(null,'/error'));
  });
}
