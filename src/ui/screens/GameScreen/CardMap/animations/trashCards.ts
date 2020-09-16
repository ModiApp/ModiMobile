import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

function useTrashCardsAnimation(
  animatedValues: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
): [boolean, () => void] {
  const [isAnimating, setIsAnimating] = useState(false);

  const animateCardsBeingTrashed = useCallback(() => {
    setIsAnimating(true);
    Animated.parallel(
      animatedValues.map(({ position, rotation }, idx) => {
        return Animated.parallel([
          Animated.timing(position, {
            delay: 100 * idx,
            toValue: { x: 0, y: boardHeight },
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            delay: 100 * idx,
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]);
      }),
    ).start(() => setIsAnimating(false));
  }, [animatedValues, boardHeight]);

  return [isAnimating, animateCardsBeingTrashed];
}

export default useTrashCardsAnimation;
