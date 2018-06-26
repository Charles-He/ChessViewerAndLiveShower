import React, {Component} from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import * as liveShowSelectors from '../store/liveshow/reducer';
import '../matchviewer.css';
import _ from 'lodash';
import * as liveshowActions from '../store/liveshow/actions';

// Let's create a Modal component that is an abstraction around
// the portal API.
class ModalContent extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
      var matchIds = [];
      var matches = this.props.matches;
      var MatchKeys = Object.keys(matches);
      Object.keys(matches).forEach(function(key) {
        matchIds.push(matches[key]['round']);
      } )
      matchIds = _.uniqBy(matchIds);
      matchIds.sort();
      // console.log(matchIds);
      return (
        <div className="modal">
            <div className="lc-menu">
                <div className="row">
                    <div className="label">round</div>
                    <div className="lc-numberlist">
                        {matchIds.map(this.renderRoundById)}
                    </div>
                </div>
                <div className="games">
                    <div className="title">
                        <div>
                            <div className="nr">Id.</div>
                            <div className="player">White</div>
                            <div className="player">Black</div>
                            <div className="result">Result</div>
                        </div>
                    </div>
                    <div className="body">
                        <div className="scroll">
                        {MatchKeys.map(this.renderMatchInfoById)}
                </div>
            </div>
        </div>
    </div>
</div>
    );
  }

    renderRoundById (roundId) {
        var selectedMatch = this.props.selectedMatch;
        var selectedRound = this.props.matches[selectedMatch]['round'];
        if (roundId === selectedRound) {
            return (
                <div className="nr selected" key={roundId}>{roundId}</div>
            );    
        } else {
            return (
                <RoundCell
                    round={roundId}
                    onClick={this.changeSelectedMatch}
                    matches={this.props.matches}
                />
            );       
        }
    }

    renderMatchInfoById (key) {
        var selectedMatch = this.props.selectedMatch;
        var selectedRound = this.props.matches[selectedMatch]['round'];
        if (this.props.matches[key]['round'] === selectedRound) {
            if (key === selectedMatch) {
                return (
                    <InfoLineS
                        id={key}
                        white={this.props.matches[key]['white']}
                        black={this.props.matches[key]['black']}
                        result={this.props.matches[key]['result']}
                        onClick={this.justClose}
                    />
                );    
            } else {
                return (
                    <InfoLine
                        id={key}
                        white={this.props.matches[key]['white']}
                        black={this.props.matches[key]['black']}
                        result={this.props.matches[key]['result']}
                        onClick={this.changeSelectedMatchAndClose}
                    />
                );       
            }
        }
    }

    changeSelectedMatch(currentMatch) {
        // console.log(currentMatch);
        this.props.dispatch(liveshowActions.selectMatch(currentMatch));
        this.props.dispatch(liveshowActions.selectMove(0,currentMatch));
    }

    changeSelectedMatchAndClose(currentMatch) {
        // console.log(currentMatch);
        this.props.dispatch(liveshowActions.selectMatch(currentMatch));
        this.props.dispatch(liveshowActions.selectMove(0,currentMatch));
        this.props.handleHide();
    }

    justClose(currentMatch) {
        this.props.handleHide();
    }
}

class RoundCell extends Component {
    handleClick = () => {
        var newMatch;
        var matches = this.props.matches;
        var clickedRound = this.props.round;
        Object.keys(matches).forEach(function(key) {
            if (matches[key]['round'] === clickedRound) {
                newMatch = key;
                return;
            }
        } )
        this.props.onClick(newMatch);
    }
  
    render() {
      return (
        <div className="nr" onClick={this.handleClick} key={this.props.round}>{this.props.round}</div>
      );
    }
}

class InfoLine extends Component {
    handleClick = () => {
        this.props.onClick(this.props.id);
    }
  
    render() {
      return (
        <div className="item" key={this.props.id} onClick={this.handleClick}>
            <div className="nr">{this.props.id}</div>
            <div className="player">{this.props.white}</div>
            <div className="player">{this.props.black}</div>
            <div className="result">{this.props.result}</div>
        </div>
      );
    }
}

class InfoLineS extends Component {
    handleClick = () => {
        this.props.onClick(this.props.id);
    }
  
    render() {
      return (
        <div className="item selected" key={this.props.id} onClick={this.handleClick}>
            <div className="nr">{this.props.id}</div>
            <div className="player">{this.props.white}</div>
            <div className="player">{this.props.black}</div>
            <div className="result">{this.props.result}</div>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    matches: liveShowSelectors.getMatches(state),
    selectedMatch: liveShowSelectors.getSelectedMatch(state)
  };
}

export default connect(mapStateToProps)(ModalContent);