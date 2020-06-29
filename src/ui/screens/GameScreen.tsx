import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, PanResponder } from 'react-native';

import { ScreenContainer, CardMiniMap } from '../components';

const GameScreen: React.FC<{
  // gameState: ModiGameState;
}> = () => {
  const [cardControlViewLayout, setCardControlViewLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const initialCardPos = {
    x: cardControlViewLayout.width / 2,
    y: cardControlViewLayout.height / 2,
  };
  const cardPosOffeset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        cardPosOffeset.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderEnd: () => {
        Animated.spring(cardPosOffeset, {
          toValue: initialCardPos,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;
  return (
    <ScreenContainer>
      <View style={{ width: '90%', marginLeft: '5%' }}>
        <CardMiniMap cards={[1, 2, 3, 4, 5, 6, 7, 8]} />
      </View>
      {/* Card control container */}

      <View
        {...panResponder.panHandlers}
        onLayout={e => setCardControlViewLayout(e.nativeEvent.layout)}
        style={{
          flex: 1,
          backgroundColor: 'green',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            height: '50%',
            aspectRatio: 25 / 35,
            backgroundColor: 'red',
            borderRadius: 8,
            transform: [
              {
                translateX: Animated.subtract(
                  Animated.add(
                    cardPosOffeset.x,
                    cardControlViewLayout.width / 2,
                  ),
                  ((cardControlViewLayout.height / 2) * (25 / 35)) / 2,
                ),
              },
              {
                translateY: Animated.add(
                  cardPosOffeset.y,
                  cardControlViewLayout.height / 4,
                ),
              },
            ],
          }}
        />
      </View>
    </ScreenContainer>
  );
};

export default GameScreen;
