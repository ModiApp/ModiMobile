import { useCallback } from 'react';

function useHighlightCardsAnimation(
  setAnimatedCards: React.Dispatch<React.SetStateAction<AnimatedCard[]>>,
) {
  return useCallback(
    (idxs: number[], color: string, onComplete?: () => void) => {
      setAnimatedCards((cards) =>
        cards.map((card, idx) => ({
          ...card,
          borderColor: idxs.includes(idx) ? color : null,
        })),
      );
      onComplete && setTimeout(onComplete, 5000);
    },
    [setAnimatedCards],
  );
}

export default useHighlightCardsAnimation;
