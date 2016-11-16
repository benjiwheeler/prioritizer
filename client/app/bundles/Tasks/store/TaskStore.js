export default {
  state: {},
  listeners: [],
  setState: function(data) {
    this.state = {
      ...this.state,
      ...data
    };
    console.log(this.state, data);
    this.notifyComponents(data);
  },
  getData: function(props) {
    let result = {};
    let state = this.state;
    props.forEach( function(prop) {
      result[prop] = state[prop];
    });
    return result;
  },
  attachListener: function(obj, props) {
    this.listeners.push({
      comp: obj,
      props
    });
  },
  removeListener: function(obj) {
    let listener = this.listeners.filter( (_listener) => _listener.comp === obj );
    if (!listener.length) return;
    // otherwise, listener has at least one item
    this.listeners.splice(this.listeners.indexOf(listener[0]), 1);
  },
  notifyComponents: function(data) {
    let changedProps = Object.keys(data);
    this.listeners.forEach( (_listener) => {
      let shouldNotify = _listener.props.some( (prop) => changedProps.indexOf(prop) > -1);
      if (shouldNotify) this.applyDataToComponent(_listener);
    });
  },
  // for this listener, make object of all keys and values it cares about,
  // and call listener's object's setState function with that properties object.
  applyDataToComponent: function(listener) {
    // we'll provide full list of properties to this object, even if unchanged
    listener.comp.setState(this.getData(listener.props));
  }
};
