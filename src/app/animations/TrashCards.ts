import { useCallback } from 'react';
import { Animated } from 'react-native';

function useTrashCardsAnimation(
  cardAnimationVals: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
) {
  return useCallback(
    (onComplete?: () => void) => {
      Animated.parallel(
        cardAnimationVals.map(({ position, rotation }, idx) => {
          return Animated.parallel([
            Animated.timing(position, {
              delay: 150 * idx,
              toValue: { x: 0, y: -boardHeight },
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(rotation, {
              delay: 150 * idx,
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]);
        }),
      ).start(onComplete);
    },
    [cardAnimationVals, boardHeight],
  );
}

export default useTrashCardsAnimation;
