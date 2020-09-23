import { useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-native';

function useDealCardsAnimation(
  numCards: number,
  animatedValues: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
  cardHeight: number,
  lastCardOrder: (Card | undefined)[],
  currCardOrder: (Card | undefined)[],
): boolean {
  const [isAnimating, setIsAnimating] = useState(false);

  const dealCards = useCallback(() => {
    setIsAnimating(true);
    const rotateFactor = (2 * Math.PI) / numCards;
    const radiusFromMidCard = (boardHeight - cardHeight - 20) / 2;

    Animated.parallel(
      animatedValues.map(({ position, rotation }, idx) => {
        const cardRotation = rotateFactor * idx + Math.PI / 2;

        return Animated.parallel([
          Animated.timing(position, {
            delay: 200 * idx,
            toValue: {
              x: Math.cos(cardRotation) * radiusFromMidCard,
              y: Math.sin(cardRotation) * radiusFromMidCard,
            },
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            delay: 200 * idx,
            toValue: cardRotation - Math.PI / 2 - Math.PI,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
      }),
    ).start(() => setIsAnimating(false));
  }, [numCards, animatedValues, boardHeight, cardHeight]);

  useEffect(() => {
    if (
      JSON.stringify(lastCardOrder) !== JSON.stringify(currCardOrder) &&
      lastCardOrder.every((card) => card === undefined) &&
      currCardOrder.filter((card) => card !== undefined).length > 0
    ) {
      dealCards();
    }
  }, [JSON.stringify(currCardOrder), boardHeight]);

  return isAnimating;
}

export default useDealCardsAnimation;
