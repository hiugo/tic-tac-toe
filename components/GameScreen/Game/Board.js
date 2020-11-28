import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tile from './Tile';

export default function Board(props) {
  const { board, onPress, boardSize } = props;

  const sizeArray = new Array(boardSize).fill(null);

  return (
    <View style={styles.container}>
      {sizeArray.map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {sizeArray.map((__, colIndex) => renderTile(rowIndex, colIndex))}
        </View>
      ))}
    </View>
  );

  function renderTile(rowIndex, colIndex) {
    const index = rowIndex * boardSize + colIndex;

    return (
      <Tile
        key={colIndex}
        value={board[index]}
        index={index}
        onPress={onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'darkgrey',
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});
