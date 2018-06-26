// containers are "smart" react components that are aware of redux
// they are connected to the redux store and listen on part of the app state
// they use mapStateToProps to specify which parts and use selectors to read them
// avoid having view logic & local component state in them, use "dumb" components instead

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
// import '../matchviewer.css';
import * as bottomSelectors from '../store/liveshow/reducer';
import * as liveshowActions from '../store/liveshow/actions';

var moves = {};

class BottomScreen extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    // console.log(this.props.currentMove);
    // if (!this.props.currentMove) return this.renderLoading();
    var lcLinkStyle = {visibility: 'visible', display: 'block'};
    return (
      // <div>
      <div className="bottom">
        <SanCell
          value={-Infinity}
          onClick={this.changeCurrentMove}
          iconHref={'#lc-icon-backward'}
        />
        <SanCell
          value={-1}
          onClick={this.changeCurrentMove}
          iconHref={'#lc-icon-rplay'}
        />
        <SanCell
          value={1}
          onClick={this.changeCurrentMove}
          iconHref={'#lc-icon-play'}
        />
        <SanCell
          value={Infinity}
          onClick={this.changeCurrentMove}
          iconHref={'#lc-icon-forward'}
        />
        <div className="lc-button">
          <svg className="lc-icon">
            <use xlinkHref="#lc-icon-move-up"></use>
          </svg>
        </div>
        <div className="lc-button">
          <svg className="lc-icon">
            <use xlinkHref="#lc-icon-move-down"></use>
          </svg>
        </div>
        <div className="lc-link" style={lcLinkStyle}>
          <a href="round-10/game-1.pgn" download="game.pgn">
            <svg className="lc-icon">
              <use xlinkHref="#lc-icon-download"></use>
            </svg>
          </a>
        </div>
        <div className="lc-button">
          <svg className="lc-icon">
            <use xlinkHref="#lc-icon-loop2"></use>
          </svg>
        </div>
        <div className="lc-button">
          <svg className="lc-icon">
            <use xlinkHref="#lc-icon-enlarge"></use>
          </svg>
        </div>
      </div>
      // </div>
    );
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }

  changeCurrentMove(value) { 
    // console.log(value);
    const limit = Number(value);
    // console.log(limit);
    let currentHalfMove = this.props.currentMove;
    // console.log(currentHalfMove);
		const direction = limit > 0 ? 1 : -1;
		let target;
		if (direction === 1) {
      target = Math.min(currentHalfMove + limit, this.props.movesLength);
      // console.log(target);
		} else {
			target = Math.max(currentHalfMove + limit, 0); // Limit will be negative
		}
    // console.log(target);
    this.props.dispatch(liveshowActions.selectMove(target, this.props.selectedMatch));

    // move the scroll list
    // var divElem = document.getElementById('sanlist');
    // document.getElementById('sanlist').scrollTop += 10;
  }
  

}

class SanCell extends Component {
  handleClick = () => {
    this.props.onClick(this.props.value);
  }

  render() {
    return (
      <div className="lc-button" onClick={this.handleClick}>
        <svg className="lc-icon">
          <use xlinkHref={this.props.iconHref}></use>
        </svg>
      </div>
    );
  }
}

// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
  
  return {
    currentMove: bottomSelectors.getSelectedMove(state),
    movesLength: bottomSelectors.getMovesLength(state),
    selectedMatch: bottomSelectors.getSelectedMatch(state),
  };

}

// export default connect(mapStateToProps)(TopScreen);
export default connect(mapStateToProps)(BottomScreen);
