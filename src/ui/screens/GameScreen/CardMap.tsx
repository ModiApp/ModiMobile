import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

import { CardBack, Text } from '@modi/ui/components';
import { useGameState } from '@modi/hooks';

const CardMap: React.FC = () => {
  const gameState = useGameState();
  const numPlaceholders = gameState.players.length;

  /** Static outlines for each players card, even when
   * cards aren't on the table */
  const CardPlaceholders = useCallback(() => {
    return <View />;
  }, [numPlaceholders]);

  return (
    <View style={styles.container}>
      <CardPlaceholders />
      <Text>Le fuckin card map bihh</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '90%',
    maxHeight: '90%',
    aspectRatio: 1,
  },
  cardContainer: {},
});

export default CardMap;
