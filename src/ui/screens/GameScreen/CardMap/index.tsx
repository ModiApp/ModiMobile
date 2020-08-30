import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import BaseLayout, { BaseLayoutRenderItem } from './BaseLayout';
import { CardBack, Text } from '@modi/ui/components';
import { useGameState } from '@modi/hooks';
import { colors } from '@modi/ui/styles';
import animateTradingCards from './animateTradingCards';

const CardMap: React.FC = () => {
  const gameState = useGameState();
  const numPlayers = 8;

  const renderPlaceholder = useCallback<BaseLayoutRenderItem>(
    () => <View style={styles.cardPlaceholder} />,
    [],
  );

  const [idxOfTrader, setIdxOfTrader] = useState<number | undefined>(1);
  useEffect(() => {
    const newIdx = idxOfTrader === numPlayers - 1 ? 0 : (idxOfTrader || 0) + 1;
    setTimeout(() => setIdxOfTrader(newIdx), 1000);
  }, [idxOfTrader]);

  const renderCard = useCallback<BaseLayoutRenderItem>(
    (idx: number, radius: number) => {
      const { rotate, translateX, translateY } = animateTradingCards(
        idx,
        radius,
        idxOfTrader,
        numPlayers,
      );
      return (
        <Animated.View
          style={{ flex: 1, transform: [{ translateX }, { translateY }] }}
        >
          <Animated.View style={[styles.card, { transform: [{ rotate }] }]} />
        </Animated.View>
      );
    },
    [numPlayers, idxOfTrader],
  );

  return (
    <View style={styles.container}>
      <View style={styles.layer}>
        <BaseLayout numPlaces={numPlayers} renderItem={renderPlaceholder} />
      </View>
      <Animated.View style={styles.layer}>
        <BaseLayout numPlaces={numPlayers} renderItem={renderCard} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
    backgroundColor: colors.lightGreen,
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPlaceholder: {
    backgroundColor: colors.feltGreen,
    flex: 1,
  },
});

export default CardMap;
