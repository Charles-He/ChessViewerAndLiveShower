// containers are "smart" react components that are aware of redux
// they are connected to the redux store and listen on part of the app state
// they use mapStateToProps to specify which parts and use selectors to read them
// avoid having view logic & local component state in them, use "dumb" components instead

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
// import '../matchviewer.css';
import * as centerActions from '../store/liveshow/actions';
import * as centerSelectors from '../store/liveshow/reducer';
import MoveListView from '../components/MoveListView';
import BoardScreen from './BoardScreen';
// import ListView from '../components/ListView';
// import ListRow from '../components/ListRow';

class CenterScreen extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    if (this.props.selectedMatch != null) {
        this.props.dispatch(centerActions.fetchMoves(this.props.selectedMatch));
    }
    console.log(this.props.selectedMatch);
  }

  componentWillUpdate(nextProps) {
    // console.log(nextProps.selectedMatch);
    // console.log(this.props.selectedMatch);
    if (nextProps.selectedMatch != this.props.selectedMatch) {
        this.props.dispatch(centerActions.fetchMoves(nextProps.selectedMatch));
    }
  }

  render() {
    // console.log(this.props.moves);
    if (!this.props.moves) return this.renderLoading();
    return (
      <div className="center">
        
        <div className="lc-players">
            <div className="black">
                <div className="lc-clock"></div>
            </div>
            <div className="white">
                <div className="lc-clock"></div>
            </div>
        </div>

        <div className="board">
            <BoardScreen moves={this.props.moves} />
        </div>

        <div className="lc-movelist">
            <div className="title">
                <div>
                    <div className="column-nr">No.</div>
                    <div className="column-san">白方</div>
                    <div className="column-san">黑方</div>
                </div>
            </div>
            <div className="list">

            <MoveListView moves={this.props.moves} />

            </div>
        
            <div className="foot">
                <div className="result">{this.props.matches[this.props.selectedMatch]['result']}</div>
            </div>
                
      </div>
    

    <div className="lc-popup"> </div>
    <div className="lc-shade" ></div>
    </div>
    );
    
  }

  renderLoading() {
    return (
      <p>Loading...</p>
    );
  }

  

} 

// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
  // console.log(state.liveshow.selectedMatch);
  
  return {
        moves: centerSelectors.getMoves(state),
        selectedMatch: centerSelectors.getSelectedMatch(state),
        matches: centerSelectors.getMatches(state)
    };
}

export default connect(mapStateToProps)(CenterScreen);
