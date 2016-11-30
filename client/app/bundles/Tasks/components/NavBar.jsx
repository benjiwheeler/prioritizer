import React, { PropTypes, Component } from 'react';
import TaskStore from '../store/TaskStore.js';
import { Link } from 'react-router';

export class NavBar extends React.Component {
  constructor(props) { // list of objects
    super(props);
    this.state = {
      ...TaskStore.getData(["tagsOrdered"])
    };
  }

  componentWillMount() { // called by React.Component
    TaskStore.attachListener(this, ["tagsOrdered"]);
  }

  componentWillUnmount() {
    TaskStore.removeListener(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props); // my hack
  }

  componentWillReceiveProps(newProps) {
    let showBack = true;
    let backQuery = null;
    let backText = 'Back';
    let backPath = '/tasks';
    try {
      showBack = newProps.showBack;
    } catch(error) {}
    try {
      backQuery = newProps.backPage.query;
    } catch(error) {}
    try {
      backText = newProps.backPage.text;
    } catch(error) {}
    try {
      backPath = newProps.backPage.pathname;
    } catch(error) {}
    this.setState({
      showBack: showBack,
      backQuery: backQuery,
      backText: backText,
      backPath: backPath
    });
  }

  render() {
    let tagsOrdered = this.state.tagsOrdered;
    let allTagsJsx = (<li></li>);
    if (tagsOrdered !== undefined && tagsOrdered !== null) {
      let tagsWithAll = [{id: "all", name: "all"}, ...tagsOrdered];
      allTagsJsx = tagsWithAll.map((tag) => (
        <li key={tag.id + "menu"}>
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
        {this.state.showBack !== false &&
          <Link to={{pathname: this.state.backPath, query: this.state.backQuery}}
          id="back_link" className='action-link' style={{float: 'left'}}>
            <div className='action-logo'>
              <i className='fa fa-arrow-left'></i>
            </div>
            <div className="shortcut-link">←&nbsp;{this.state.backText}</div>
          </Link>
        }
      {/* had to override bootstrap position for dropdown, otherwise squashing
      nearby links */}
        <div className='dropdown' style={{position: 'inherit'}}>
          <a id='tag_menu_link' aria-expanded='false' aria-haspopup='true' className='action-link dropdown-toggle' rel="nofollow" data-toggle='dropdown' href='#' role='button'>
            <div className='action-logo'>
              <i className='fa fa-binoculars'></i>
            </div>
            <div className='shortcut-link'>Lens<span className='caret'></span></div>
          </a>
          <ul className='dropdown-menu'>
            {allTagsJsx}
          </ul>
        </div>
      </div>
    );
  }
}
