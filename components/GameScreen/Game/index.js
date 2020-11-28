import React, { Component } from 'react';
import TicTacToe from 'tictactoe-agent';
import Board from './Board';
import { View, Button, Text } from 'react-native';
import { USER_FIGURE, AI_FIGURE, EMPTY, DRAW } from './constants';

const DEFAULT_SIZE = 5;

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: new Array(DEFAULT_SIZE * DEFAULT_SIZE).fill(EMPTY),
      size: DEFAULT_SIZE,
    };
  }

  _populateTile(index, figure, onFinish = f => f) {
    if (this.state.board[index] !== EMPTY) {
      return;
    }

    const board = [...this.state.board];
    board[index] = figure;

    this.setState(
      {
        board,
      },
      () => {
        const result = this._judgeWinner();

        if (result !== null) {
          this.props.onFinish(result);
        }

        onFinish();
      },
    );
  }

  _AIAct() {
    const input = this.state.board.join('');
    const model = new TicTacToe.Model(input, AI_FIGURE);
    const recommendation = model.getRecommendation();

    this._populateTile(recommendation.index, AI_FIGURE);
  }

  _judgeWinner() {
    if (!this.state.board.some(figure => figure === EMPTY)) {
      return DRAW;
    }

    // This is no way optimized
    // My goal is just to have it working with the different board size
    const victoryConditionsRows = new Array(this.state.size)
      .fill(null)
      .map((_, rowIndex) =>
        new Array(this.state.size)
          .fill(null)
          .map((__, colIndex) => colIndex + rowIndex * this.state.size),
      );

    const victoryConditionsCols = new Array(this.state.size)
      .fill(null)
      .map((_, rowIndex) =>
        new Array(this.state.size)
          .fill(null)
          .map((__, colIndex) => rowIndex + colIndex * this.state.size),
      );

    const victoryConditionsDiagonal = new Array(2).fill(null).map((_, i) =>
      new Array(this.state.size).fill(null).map((__, index) => {
        if (i === 0) {
          return index * this.state.size + index;
        }

        return this.state.size * (index + 1) - (index + 1);
      }),
    );

    const victoryConditions = [
      ...victoryConditionsRows,
      ...victoryConditionsCols,
      ...victoryConditionsDiagonal,
    ];

    let winner = null;
    for (let i = 0; i < victoryConditions.length; ++i) {
      let figure = this.state.board[victoryConditions[i][0]];

      if (victoryConditions[i].every(tile => this._checkTile(tile, figure))) {
        winner = figure;
        break;
      }
    }

    return winner;
  }

  _checkTile(tile, figure) {
    return (
      this.state.board[tile] === figure && this.state.board[tile] !== EMPTY
    );
  }

  _clearField() {
    this.setState({
      board: new Array(this.state.size * this.state.size).fill(EMPTY),
    });
  }

  _handlePress = index => {
    this._populateTile(index, USER_FIGURE, () => this._AIAct());
  };

  _handleChangeSize = number => {
    if (this.state.size + number >= 2) {
      this.setState({
        size: this.state.size + number,
      });
      this._clearField();
    }
  };

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text>Border size: {this.state.size}</Text>
        </View>
        <Button onPress={() => this._handleChangeSize(-1)} title="Size -1" />
        <Button onPress={() => this._handleChangeSize(1)} title="Size +1" />
        <Board
          board={this.state.board}
          onPress={this._handlePress}
          boardSize={this.state.size}
        />
      </View>
    );
  }
}
