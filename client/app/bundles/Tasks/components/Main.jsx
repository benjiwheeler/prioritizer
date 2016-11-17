import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import {provideInitialState, fetchTags, fetchTasks} from '../TaskActions';
import { Link } from 'react-router';

export class NavBar extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = TaskStore.getData(["tagsOrdered"]);
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tagsOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  render() {
    let { tagsOrdered } = this.state;
    let allTagsJsx = (<li></li>);
    if (tagsOrdered !== undefined && tagsOrdered !== null) {
      allTagsJsx = tagsOrdered.map((tag) => (
                            <li key={tag.id}>
                          {tag.name}
          <Link to={{
              pathname: "/tasks/next",
              query: {tag: tag.name}
              }}>
                        <span style={{color: "green"}}>
                          {tag.name}
                        </span>
                      </Link>
                    </li>
      ));
    }
    return (
      <ul>
                <li className='dropdown'>
                  <a aria-expanded='false' aria-haspopup='true' className='dropdown-toggle' data-toggle='dropdown' href='#' role='button'>
                    Where
                    <span className='caret'></span>
                  </a>
                  <ul className='dropdown-menu'>
                          {allTagsJsx}
                  </ul>
                </li>
      </ul>
    );
  }
}

export class Main extends React.Component {
  componentWillMount() { // called by React.Component
    provideInitialState();
    fetchTasks();
    fetchTags();
  }

  render() {
    return (
      <div>
        Main
        <NavBar />
        <div>Other Content</div>
        {this.props.children}
      </div>
    );
  }
}

