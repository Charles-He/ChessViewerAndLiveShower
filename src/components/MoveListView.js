// components are "dumb" react components that are not aware of redux
// they receive data from their parents through regular react props
// they are allowed to have local component state and view logic
// use them to avoid having view logic & local component state in "smart" components

import _ from 'lodash';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
import '../matchviewer.css';
// import Chessdiagram from 'react-chessdiagram';
import * as liveshowActions from '../store/liveshow/actions';
import * as liveShowSelectors from '../store/liveshow/reducer';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

const Sockette = require('sockette');

var newArray = [];
// var myMovePgnHead = new Chessdiagram;

class MoveListView extends Component {

  constructor(props) {
    super(props);
    autoBind(this);

    function Item(move, sanw, sanb) {
      this.move = move;
      this.sanw = sanw;
      this.sanb = sanb;
    }
  
    // var newArray = [];
    // console.log(this.props.moves);
    newArray = [];
    var initObj = this.props.moves;
    var newKey = [];
    var marker = [];
    var newColor = [];
    var lastMoveId;

    // console.log(initObj);
    Object.keys(initObj).forEach(function(key) {
      newKey = key.match(/\d+/);
      if (newKey == null) { return; }
      lastMoveId = newKey[0];
      // console.log(newKey[0]);
      newColor = key.match(/[a-z]+/);
      // console.log(newColor[0]);
		  // sans = newObj[newKey[0]];
	    if (newColor[0] === "white") {
        // console.log(initObj[key].san);
		    if (marker[newKey[0]] != null) {
          newArray[newKey[0]] = new Item(newKey[0], initObj[key].san, marker[newKey[0]]);
          // console.log(marker[newKey[0]]);
        } else {
          marker[newKey[0]] = initObj[key].san;
          // console.log(initObj[key].san);
        }
	    } else {
        if (marker[newKey[0]] != null) { 
          newArray[newKey[0]] = new Item(newKey[0], marker[newKey[0]], initObj[key].san);
        } else {
          marker[newKey[0]] = initObj[key].san;
        }
      }
      // console.log(newKey[0]);
    } );
    // console.log(newColor);
    // process the last step which only have the move of white
    if (newArray[lastMoveId] == null) {
      if (newColor[0] === "white") {
        newArray[lastMoveId] = new Item(lastMoveId, marker[lastMoveId], undefined);
      } else {
        newArray[lastMoveId] = new Item(lastMoveId, undefined, marker[lastMoveId]);
      }
    }
    // console.log(newArray);
  }

  componentDidMount(prevProps) {
    

    // if the game have no result, then open websocket channel
    // console.log(this.props.matches[this.props.selectedMatch]['result']);
    if (this.props.matches[this.props.selectedMatch]['result'] === '直播中') {
      // console.log("I'm live.", this.props.selectedMatch);

      const CHESSLIVE_ENDPOINT = "ws://192.168.1.2:8080/api/v1/todos/channel/" + this.props.selectedMatch + "/ws";
      const ws = new Sockette(CHESSLIVE_ENDPOINT, {
        timeout: 5e3,
        maxAttempts: 10,
        onopen: e => console.log('Connected!', e),
        onmessage: e => {
          console.log(e['data']);
          if (e['data'] != "Update moves") {
            var myObj = JSON.parse(e['data']);
            console.log(myObj.Result);
            this.props.dispatch(liveshowActions.addResult(myObj.Matchid, myObj.Result));
            ws.close();
          } else {
            this.props.dispatch(liveshowActions.fetchMoves(this.props.selectedMatch));
          }
          // this.props.dispatch(liveshowActions.selectMove(this.props.movesLength));
        },
        onreconnect: e => console.log('Reconnecting...', e),
        onmaximum: e => console.log('Stop Attempting!', e),
        onclose: e => console.log('Closed!', e),
        onerror: e => console.log('Error:', e)
      });

      // Reconnect 10s later
      // setTimeout(ws.reconnect, 10e3);

    }
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.matches[this.props.selectedMatch]['result'] === '直播中') {
      if (nextProps.matches[nextProps.selectedMatch]['result'] === '直播中') {
		  if (nextProps.movesLength && nextProps.movesLength !== this.props.movesLength) {
        console.log(nextProps.movesLength);
    console.log(this.props.movesLength);
        // this.props.dispatch(liveshowActions.selectMove(nextProps.movesLength, this.props.selectedMatch));
        this.props.dispatch(liveshowActions.selectMove(nextProps.movesLength, nextProps.selectedMatch));
      }
    }
  }

  componentDidUpdate() {
      this.ensureActiveItemVisible();
  }

  componentWillUpdate(nextProps) {

    // console.log(this.props.moves);
    function Item(move, sanw, sanb) {
      this.move = move;
      this.sanw = sanw;
      this.sanb = sanb;
    }
  
    // var newArray = [];
    newArray = [];
    var initObj = this.props.moves;
    var newKey = [];
    var marker = [];
    var newColor = [];
    var lastMoveId;

    // console.log(initObj);
    Object.keys(initObj).forEach(function(key) {
      newKey = key.match(/\d+/);
      if (newKey == null) { return; }
      lastMoveId = newKey[0];
      // console.log(newKey[0]);
      newColor = key.match(/[a-z]+/);
      // console.log(newColor[0]);
		  // sans = newObj[newKey[0]];
	    if (newColor[0] === "white") {
        // console.log(initObj[key].san);
		    if (marker[newKey[0]] != null) {
          newArray[newKey[0]] = new Item(newKey[0], initObj[key].san, marker[newKey[0]]);
          // console.log(marker[newKey[0]]);
        } else {
          marker[newKey[0]] = initObj[key].san;
          // console.log(initObj[key].san);
        }
	    } else {
        if (marker[newKey[0]] != null) { 
          newArray[newKey[0]] = new Item(newKey[0], marker[newKey[0]], initObj[key].san);
        } else {
          marker[newKey[0]] = initObj[key].san;
        }
      }
      // console.log(newKey[0]);
    } );
    // console.log(newColor);
    // process the last step which only have the move of white
    if (newArray[lastMoveId] == null) {
      if (newColor[0] === "white") {
        newArray[lastMoveId] = new Item(lastMoveId, marker[lastMoveId], undefined);
      } else {
        newArray[lastMoveId] = new Item(lastMoveId, undefined, marker[lastMoveId]);
      }
    }

    if (this.props.matches[this.props.selectedMatch]['result'] === '直播中') {
		  if (nextProps.movesLength && nextProps.movesLength !== this.props.movesLength) {
        // console.log(nextProps.movesLength);
        // console.log(this.props.movesLength);
			  this.props.dispatch(liveshowActions.selectMove(nextProps.movesLength, this.props.selectedMatch));
      }
    }
  }
  

  render() {
    // console.log(this.props.moves);
    
    return (

      <div className="scroll">
        {newArray.map(this.renderRowById)}
      </div>

    );

  }

  
  renderRowById (myObj) {
    var currentMoveW = myObj.move*2-1;
    var currentMoveB = myObj.move*2;

    if (currentMoveW === this.props.selectedMove || currentMoveB === this.props.selectedMove) {
      // console.log(myObj.move);
      var active = myObj.move;
    }
    var props = {
      active: active
    };
    if (active) {
      props.ref = "activeItem";
      // console.log(props.ref);
    }

    // determain the position scroll to
    
      return (
        <div className="item" key={myObj.move} {...props}>
          <div className="column-nr">
            {myObj.move}
            .
          </div>
          
          <SanCell
            value={currentMoveW}
            onClick={this.changeCurrentMove}
            san={myObj.sanw}
            selectedMove={this.props.selectedMove}
            scrollTo={this.scrollToBottom}
          />
          
          <SanCell
            value={currentMoveB}
            onClick={this.changeCurrentMove}
            san={myObj.sanb}
            selectedMove={this.props.selectedMove}
            scrollTo={this.scrollToBottom}
          />
        </div>
      );
    
  }

  

  changeCurrentMove(currentMove) {
    this.props.dispatch(liveshowActions.selectMove(currentMove, this.props.selectedMatch));
  }

  // currently not used, because sorting this.props.moves is painful. Maybe implement in future
  // and use compnentWillMount to do it.
  sortMoves() {
    console.log(this.props.moves);
    var ordered = {};
    var newObj = this.props.moves;
    Object.keys(newObj).sort().forEach(function(key) {
      ordered[key] = newObj[key];
    });
    console.log(ordered);
    return ordered;
  }

  ensureActiveItemVisible() {
    // console.log(this.refs.activeItem);
    var itemComponent = this.refs.activeItem;
    if (itemComponent) {
      var domNode = ReactDOM.findDOMNode(itemComponent);
      domNode.scrollIntoView({block: 'center', behavior: 'smooth'});
    }
  }

}



class SanCell extends Component {

  handleClick = () => {
    this.props.onClick(this.props.value);
  }

  render() {
    var highLight;
    if (this.props.selectedMove === this.props.value) {
      highLight = "column-san selected";
    } else {
      highLight = "column-san";
    }
    return (
      <div className={highLight} onClick={this.handleClick}> {this.props.san} </div>
    );
  }
}

// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
  return {
    selectedMove: liveShowSelectors.getSelectedMove(state),
    matches: liveShowSelectors.getMatches(state),
    selectedMatch: liveShowSelectors.getSelectedMatch(state),
    movesLength: liveShowSelectors.getMovesLength(state)
  };
}

export default connect(mapStateToProps)(MoveListView);
