import { useCallback } from 'react';

function useFlipCardsAnimation(
  setAnimatedCards: React.Dispatch<React.SetStateAction<AnimatedCard[]>>,
) {
  return useCallback(
    (newCardMap: CardMap) => {
      setAnimatedCards((cards) =>
        cards.map((card, idx) => ({
          ...card,
          value: newCardMap[idx],
        })),
      );
    },
    [setAnimatedCards],
  );
}

export default useFlipCardsAnimation;
