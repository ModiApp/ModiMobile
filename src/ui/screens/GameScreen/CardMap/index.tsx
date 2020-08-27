import React, { useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import BaseLayout, { BaseLayoutRenderItem } from './BaseLayout';
import { CardBack, Text } from '@modi/ui/components';
import { useGameState } from '@modi/hooks';
import { colors } from '@modi/ui/styles';

const CardMap: React.FC = () => {
  const gameState = useGameState();
  const numPlayers = 8;

  const renderPlaceholder = useCallback<BaseLayoutRenderItem>(
    () => <View style={styles.cardPlaceholder} />,
    [],
  );

  const renderCard = useCallback<BaseLayoutRenderItem>(
    () => <View style={{ flex: 1, backgroundColor: 'red' }} />,
    [],
  );

  const cardRotation = useRef(new Animated.Value(0)).current;
  const didStartRotating = useRef(false);
  // useEffect(() => {
  //   if (!didStartRotating.current) {
  //     spinCards();
  //     didStartRotating.current = true;
  //   }
  // }, []);

  // const spinCards = useCallback(() => {
  //   cardRotation.setValue(0);
  //   Animated.timing(cardRotation, {
  //     toValue: 2 * Math.PI,
  //     duration: 4000,
  //     useNativeDriver: true,
  //   }).start(spinCards);
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.layer}>
        <BaseLayout numPlaces={numPlayers} renderItem={renderPlaceholder} />
      </View>
      <Animated.View
        style={[
          styles.layer,
          {
            transform: [{ rotate: cardRotation }],
          },
        ]}
      >
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
    backgroundColor: 'blue',
  },
  layer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardPlaceholder: {
    backgroundColor: colors.lightGreen,
    shadowColor: '#000',
    flex: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default CardMap;
