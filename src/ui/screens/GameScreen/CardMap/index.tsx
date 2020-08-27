import React, { useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import BaseLayout, { BaseLayoutRenderItem } from './BaseLayout';
import { CardBack, Text } from '@modi/ui/components';
import { useGameState } from '@modi/hooks';
import { colors } from '@modi/ui/styles';
import { indexOf } from 'lodash';

const CardMap: React.FC = () => {
  const gameState = useGameState();
  const numPlayers = 8;

  const renderPlaceholder = useCallback<BaseLayoutRenderItem>(
    () => <View style={styles.cardPlaceholder} />,
    [],
  );

  const renderCard = useCallback<BaseLayoutRenderItem>(
    (idx: number, radius: number) => {
      const rotationFactor = (2 * Math.PI) / numPlayers;
      const rotate = new Animated.Value(0);
      const translateX = new Animated.Value(0);
      const translateY = new Animated.Value(0);

      const idxOfTrader = 7;
      if (idx === idxOfTrader) {
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: rotationFactor,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -(Math.cos(rotationFactor) * radius),
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -Math.sin(rotationFactor) * radius * 0.42,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          rotate.setValue(0);
          translateX.setValue(0);
          translateY.setValue(0);
        });
      }
      if (idx === (idxOfTrader + 1) % numPlayers) {
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: -rotationFactor,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: Math.cos(rotationFactor) * radius,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -Math.sin(rotationFactor) * radius * 0.42,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          rotate.setValue(0);
          translateX.setValue(0);
          translateY.setValue(0);
        });
      }
      return (
        <Animated.View
          style={{ flex: 1, transform: [{ translateX }, { translateY }] }}
        >
          <Animated.View style={[styles.card, { transform: [{ rotate }] }]} />
        </Animated.View>
      );
    },
    [numPlayers],
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
    // borderRadius: 10,
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
