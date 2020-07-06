import React, { useState, useCallback } from 'react';
import { View, Animated, PanResponder } from 'react-native';

import { ScreenContainer, CardMiniMap } from '../components';

const GameScreen: React.FC<{
  // gameState: ModiGameState;
}> = () => {
  const [boardRadius, setBoardRadius] = useState(0);
  const [cardControlViewLayout, setCardControlViewLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const initialCardPos = {
    x: cardControlViewLayout.width / 2,
    y: boardRadius,
  };

  const cardPosOffeset = useCallback(
    () => new Animated.ValueXY(initialCardPos),
    [boardRadius, cardControlViewLayout],
  )();

  const panResponder = useCallback(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          let x, y: number;
          if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
            y = Math.sqrt(
              Math.pow(boardRadius, 2) - Math.pow(gestureState.dx, 2),
            );
            x = initialCardPos.x + gestureState.dx;
          } else {
            y = Math.sqrt(
              Math.pow(boardRadius, 2) - Math.pow(gestureState.dy, 2),
            );
            x = initialCardPos.y + gestureState.dy;
          }
          cardPosOffeset.setValue({ x, y });
        },
        onPanResponderEnd: () => {
          Animated.spring(cardPosOffeset, {
            toValue: initialCardPos,
            useNativeDriver: true,
          }).start();
        },
      }),
    [boardRadius],
  )();

  return (
    <ScreenContainer>
      <View style={{ width: '90%', marginLeft: '5%' }}>
        <CardMiniMap
          cards={[1, 2, 3, 4, 5, 6, 7, 8]}
          onRadius={r => setBoardRadius(r * 1.5)}
        />
      </View>

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
              { translateX: cardPosOffeset.x },
              { translateY: cardPosOffeset.y },
              { translateX: -((25 / 35) * cardControlViewLayout.height) / 4 },
              { translateY: -cardControlViewLayout.height / 4 },
            ],
          }}
        />
      </View>
    </ScreenContainer>
  );
};

export default GameScreen;
