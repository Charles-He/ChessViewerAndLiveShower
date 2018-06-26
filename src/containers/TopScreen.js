// containers are "smart" react components that are aware of redux
// they are connected to the redux store and listen on part of the app state
// they use mapStateToProps to specify which parts and use selectors to read them
// avoid having view logic & local component state in them, use "dumb" components instead

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
// import '../matchviewer.css';
import * as liveShowActions from '../store/liveshow/actions';
import * as liveShowSelectors from '../store/liveshow/reducer';
import LogoView from '../components/LogoView';
import ModalContent from '../components/PortalsMatchesList';
import ReactDOM from 'react-dom';

// const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');


class TopScreen extends Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {showModal: false};
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  componentDidMount() {
    // console.log(this.props.event);
    this.props.dispatch(liveShowActions.fetchMatches(this.props.userid, this.props.event));
  }

  handleShow() {
    this.setState({showModal: true});
  }
  
  handleHide() {
    this.setState({showModal: false});
  }


  render() {

    // Modal = new matchesList.Modal;

    const modal = this.state.showModal ? (
      <Modal>
        <ModalContent
          handleHide={this.handleHide}
        />
      </Modal>
    ) : null;

    if (!this.props.selectedMatch) return this.renderLoading();

    return (
      <div className="top">
        <LogoView /> 
        
        
        <div className="menu" onClick={this.handleShow}>
          <div className="title">
            {this.props.matches[this.props.selectedMatch]['event']}
          </div>
          <div className="names">
            <div className="lc-gv-name lc-grow">
              {this.props.matches[this.props.selectedMatch]['white']}
            </div>
            <span className="name-sep">vs</span>
            <div className="lc-gv-name lc-grow">
              {this.props.matches[this.props.selectedMatch]['black']}
            </div>
          </div>
        </div> 

        {modal}
     
        <div className="subtitle">
          <div className="{this.attr.style}-item">第 {this.props.matches[this.props.selectedMatch]['round']} 轮</div>
          <div className="{this.attr.style}-item">日期 {this.props.matches[this.props.selectedMatch]['date']}</div>
        </div>
      </div>
    );
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
  }
  
  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el,
    );
  }
}



// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
  return {
    matches: liveShowSelectors.getMatches(state),
    selectedMatch: liveShowSelectors.getSelectedMatch(state)
  };
}


export default connect(mapStateToProps)(TopScreen);


