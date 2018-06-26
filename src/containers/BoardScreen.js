// components are "dumb" react components that are not aware of redux
// they receive data from their parents through regular react props
// they are allowed to have local component state and view logic
// use them to avoid having view logic & local component state in "smart" components

import _ from 'lodash';
import React, { Component } from 'react';
import autoBind from 'react-autobind';
// import '../matchviewer.css';
import Chessdiagram from '../components/chessDiagram/chessdiagram';
import Chess from 'chess.js';
import '../../public/App.css';
import { connect } from 'react-redux';
import * as boardActions from '../store/chessboard/actions';
import * as boardSelectors from '../store/chessboard/reducer';

class BoardScreen extends Component {

    constructor(props) {
      super(props);
      
    }
  
    
  // event handlers:
  
    _onFenChanged(evt) { // user inputted new position
      this.setState({fen: evt.target.value});
    }
  
    _onFlipChanged(evt) { //flip board
      this.setState({flip: evt.target.checked});
    }
  
    _onLightSquareColorChanged(evt) {
      this.setState({lightSquareColor: evt.target.value});
    }
  
    _onDarkSquareColorChanged(evt) {
      this.setState({darkSquareColor: evt.target.value});
    }
  
    _onMovePiece(piece, fromSquare, toSquare) { // user moved a piece
      clearTimeout(this.timeout);
      // echo move back to user:
      let message = 'You moved ' + piece + fromSquare + " to " + toSquare + ' !';
      this.setState({lastMessage: message}, () => {
        this.timeout = setTimeout(() => {this.setState({lastMessage: ''})}, 2000)
      });
    }
  
    _onFilesChanged(evt) {
      this.setState({files: Number(evt.target.value)});
    }
  
    _onRanksChanged(evt) {
      this.setState({ranks: Number(evt.target.value)});
    }
  
    _onGameTypeChange(evt) {
      this.setState(Object.assign(this.gamePresets[evt.target.value], {gameType: evt.target.value}));
    }
  
    _onPgnChanged(evt) {
      this.setState({pgn: evt.target.value});
      this.game.load_pgn(evt.target.value);
    }
  
  // the render() function:
    render() {
      // console.log(this.props.startMove);
      return (
        <div className="demo">
          
            <Chessdiagram
              darkSquareColor={this.props.darkSquareColor}
              fen={this.props.fen}
              gameHistory={this.props.gameHistory}
              startPosition={this.props.currentPosition}
              files={this.props.files}
              flip={this.props.flip}
              lightSquareColor={this.props.lightSquareColor}
              onMovePiece={this._onMovePiece.bind(this)}
              pgn={this.props.pgn}
              // pieceDefinitions={this.gamePresets[this.props.gameType].pieceDefinitions}
              pieceDefinitions={this.props.pieceDefinitions}
              ranks={this.props.ranks}
              squareSize={this.props.squareSize}
              startMove={this.props.startMove}
            />
          
        </div>
      );
    }
}

// which props do we want to inject, given the global store state?
// always use selectors here and avoid accessing the state directly
function mapStateToProps(state) {
    
    return {
      darkSquareColor:boardSelectors.getDarkSquareColor(state),
      fen:boardSelectors.getFen(state),
      gameHistory:boardSelectors.getGameHistory(state),
      startPosition:boardSelectors.getStartPosition(state),
      files:boardSelectors.getFiles(state),
      flip:boardSelectors.getFlip(state),
      lightSquareColor:boardSelectors.getLightSquareColor(state),
      // onMovePiece={this._onMovePiece.bind(this)}
      pgn:boardSelectors.getPgn(state),
      pieceDefinitions:boardSelectors.getPieceDefinitions(state),
      ranks:boardSelectors.getRanks(state),
      squareSize:boardSelectors.getSquareSize(state),
      // startMove:boardSelectors.getStartMove(state)
      startMove:boardSelectors.getStartMove(state)
    };
  }

export default connect(mapStateToProps)(BoardScreen);