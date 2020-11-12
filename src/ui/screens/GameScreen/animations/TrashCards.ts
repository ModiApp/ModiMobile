import { useCallback } from 'react';
import { Animated } from 'react-native';

function useTrashCardsAnimation(
  animatedCards: AnimatedCard[],
  setAnimatedCards: React.Dispatch<React.SetStateAction<AnimatedCard[]>>,
  boardHeight: number,
) {
  return useCallback(
    (onComplete?: () => void) => {
      Animated.parallel(
        animatedCards.map(({ position, rotation }, idx) => {
          return Animated.parallel([
            Animated.timing(position, {
              delay: 150 * idx,
              toValue: { x: 0, y: boardHeight },
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
      ).start(() => {
        setAnimatedCards([]);
        onComplete && onComplete();
      });
    },
    [animatedCards, boardHeight],
  );
}

export default useTrashCardsAnimation;
