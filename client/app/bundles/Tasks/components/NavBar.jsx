import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import { Link } from 'react-router';

export class NavBar extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tagsOrdered"]),
      backQuery: null,
      backText: "Back",
      backPath: '/tasks'
    };

  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tagsOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.backPage !== undefined && newProps.backPage !== null) {
      this.setState({
        backQuery: newProps.backPage.query,
        backText: newProps.backPage.text,
        backPath: newProps.backPage.pathname
      });
    }
  }

  render() {
    let { tagsOrdered } = this.state;
    let allTagsJsx = (<li></li>);
    if (tagsOrdered !== undefined && tagsOrdered !== null) {
      allTagsJsx = tagsOrdered.map((tag) => (
        <li key={tag.id}>
          {tag.name}
          <Link to={{pathname: this.props.to, query: {tagName: tag.name}}}>
            <span style={{color: "green"}}>
              {tag.name}
            </span>
          </Link>
        </li>
      ));
    }
    return (
      <div>
        {this.props.showBack !== false &&
          <Link to={{pathname: this.state.backPath, query: this.state.backQuery}}>
            &lt;&nbsp;{this.state.backText}
          </Link>
        }
        <div className='dropdown'>
          <a aria-expanded='false' aria-haspopup='true' className='dropdown-toggle' data-toggle='dropdown' href='#' role='button'>
            Where
            <span className='caret'></span>
          </a>
          <ul className='dropdown-menu'>
            {allTagsJsx}
          </ul>
        </div>
      </div>
    );
  }
}
