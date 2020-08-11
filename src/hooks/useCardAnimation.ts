import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

import { getPlayerCard, cardsAreEqual } from '../util';
import useGameStateHistory from './useGameStateHistory';

function useCardAnimation(gameState: ModiGameState, currPlayerId: string) {
  const gameStateHistory = useGameStateHistory(gameState);
  const animatedCardPos = useRef(new Animated.ValueXY({ x: 0, y: 1 })).current;
  const [card, setCard] = useState(
    gameState.players.find((player) => player.id === currPlayerId)?.card,
  );

  function animate() {
    const nextState = gameStateHistory.dequeue();
    const newCard = getPlayerCard(nextState, currPlayerId);

    const gotDifferentCard = !cardsAreEqual(card, newCard);
    if (gotDifferentCard) {
      setCouldRunNextAnimation(false);
    }

    if (card === undefined && newCard !== undefined) {
      // We were dealt a card, animate from top
      setCard(newCard);
      Animated.timing(animatedCardPos, {
        toValue: { x: 0, y: 0 },
        duration: 3000,
        useNativeDriver: true,
      }).start(() => setCouldRunNextAnimation(true));
    } else if (card !== undefined && newCard === undefined) {
      // Our card was removed, animate to top
      Animated.timing(animatedCardPos, {
        toValue: { x: 0, y: 1 },
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setCard(undefined);
        setCouldRunNextAnimation(true);
      });
    } else if (gotDifferentCard) {
      const wasTradedWith =
        nextState.players.findIndex((player) => player.id === currPlayerId) ===
        nextState.moves.length;
      Animated.timing(animatedCardPos, {
        toValue: { x: wasTradedWith ? 1 : -1, y: 0 },
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setCard(newCard);
        Animated.timing(animatedCardPos, {
          toValue: { x: 0, y: 0 },
          duration: 3000,
          useNativeDriver: true,
        }).start(() => setCouldRunNextAnimation(true));
      });
    }
  }

  const [couldRunNextAnimation, setCouldRunNextAnimation] = useState(true);
  useEffect(() => {
    console.log('couldAnimate', couldRunNextAnimation);
    if (couldRunNextAnimation && gameStateHistory.length > 0) {
      animate();
    } else if (gameStateHistory.length === 0) {
      const newCard = getPlayerCard(gameState, currPlayerId);
      if (!cardsAreEqual(card, newCard)) {
        setCard(getPlayerCard(gameState, currPlayerId));
      }
    }
  });

  return [card, animatedCardPos];
}

export default useCardAnimation;
