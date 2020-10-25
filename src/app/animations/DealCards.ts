import React, { useCallback } from 'react';
import { Animated } from 'react-native';

import { normalizeAngle, calcCardHeight } from './util';

type CardMap = (Card | boolean)[];

function useDealCardsAnimation(
  setAnimatedCards: React.Dispatch<React.SetStateAction<AnimatedCard[]>>,
  boardHeight: number,
) {
  return useCallback(
    (cards: CardMap, onComplete?: () => void) => {
      const cardHeight = calcCardHeight(cards.length, boardHeight);
      const cardWidth = cardHeight / 1.528;
      const rotationFactor = (2 * Math.PI) / cards.length;
      const boardRadius = (boardHeight - cardHeight - 20) / 2;

      const dealerRotation = rotationFactor * (cards.length - 1);
      const initialDeckPos = {
        x: Math.cos(dealerRotation + Math.PI / 2) * boardRadius * 3,
        y: Math.sin(dealerRotation + Math.PI / 2) * boardRadius * 3,
      };

      const animatedCards = cards.map((value) => ({
        position: new Animated.ValueXY(initialDeckPos),
        rotation: new Animated.Value(0),
        dimensions: {
          width: cardWidth,
          height: cardHeight,
        },
        value,
      }));

      setAnimatedCards(animatedCards);

      Animated.parallel(
        animatedCards.map((cardVal, idx) => {
          const cardRotation = rotationFactor * idx;
          return Animated.parallel([
            Animated.timing(cardVal.position, {
              delay: 400 * idx,
              duration: 1000,
              toValue: {
                x: Math.cos(cardRotation + Math.PI / 2) * boardRadius,
                y: Math.sin(cardRotation + Math.PI / 2) * boardRadius,
              },
              useNativeDriver: true,
            }),
            Animated.timing(cardVal.rotation, {
              delay: 400 * idx,
              duration: 1000,
              toValue: normalizeAngle(cardRotation),
              useNativeDriver: true,
            }),
          ]);
        }),
      ).start(onComplete);
    },
    [setAnimatedCards, boardHeight],
  );
}

export default useDealCardsAnimation;
