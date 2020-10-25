import React, { useCallback } from 'react';
import { Animated } from 'react-native';

import { normalizeAngle } from './util';

type CardMap = (Card | boolean)[];

function useDealCardsAnimation(
  setCards: React.Dispatch<React.SetStateAction<CardMap>>,
  cardAnimationVals: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
  cardHeight: number,
) {
  return useCallback(
    (cards: CardMap, onComplete?: () => void) => {
      const rotationFactor = (2 * Math.PI) / cardAnimationVals.length;
      const boardRadius = (boardHeight - cardHeight - 20) / 2;

      // Start cards off coming from dealers locaion on table
      const dealerRotation = rotationFactor * (cardAnimationVals.length - 1);
      cardAnimationVals.forEach(({ position, rotation }) => {
        position.setValue({
          x: Math.cos(dealerRotation + Math.PI / 2) * boardRadius * 3,
          y: Math.sin(dealerRotation + Math.PI / 2) * boardRadius * 3,
        });
        rotation.setValue(normalizeAngle(dealerRotation));
      });

      // Set cards while they're off the table
      setCards(cards);

      Animated.parallel(
        cardAnimationVals.map((cardVal, idx) => {
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
    [cardAnimationVals, boardHeight, cardHeight],
  );
}

export default useDealCardsAnimation;
