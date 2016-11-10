import React, { PropTypes } from 'react';

export default class TaskList extends React.Component {
  static propTypes = {
  };

  // React will automatically provide us with the event `e`
  handleChange(e) {
    const name = e.target.value;
  }

  render() {
    return (
      <div>
        Tasks go here!
      </div>
    );
  }
}
