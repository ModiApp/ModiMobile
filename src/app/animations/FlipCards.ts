import { useCallback } from 'react';
import { Animated } from 'react-native';

function useFlipCardsAnimation(
  setCards: React.Dispatch<React.SetStateAction<AnimatedCard[]>>,
) {
  return useCallback((idxs: number[]) => {}, []);
}

export default useFlipCardsAnimation;
