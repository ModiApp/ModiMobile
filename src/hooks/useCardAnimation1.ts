import { useEffect, useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

import { cardsAreEqual } from '../util';

/**
 * Provides an animated value of where the card should animate from / to based
 * on current, and previous gameStates. X animates when a trade occurs,
 * y animates when getting dealt a card, or losing your card.
 */
function useCardAnimation(
  gameState: ModiGameState,
  currPlayerId: PlayerId | undefined,
): [Card | undefined, Animated.ValueXY] {
  const [card, setCard] = useState(
    gameState.players.find((player) => player.id === currPlayerId)?.card,
  );

  const cardPosAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const gameStateHistoryQueue = useRef([gameState]).current;

  const [isAnimating, setIsAnimating] = useState(false);
  const runAnimation = useCallback(
    (newGameState: ModiGameState) => {
      setIsAnimating(true);
      console.log('runAnimation was called with', newGameState);
      const newCardValue = newGameState.players.find(
        (player) => player.id === currPlayerId,
      )?.card;
      const { moves, players } = newGameState;
      console.log('newGameState.players.length', players.length);

      console.log('CURRENT CARD:', card, 'NEW CARD', newCardValue);

      // Only animate if cards changed during this gamestate diff
      if (!cardsAreEqual(newCardValue, card)) {
        console.log(
          'starting animation for state:',
          JSON.stringify(newGameState, undefined, '  '),
        );

        // If we didn't have a card, we just got dealt one
        if (!card && !!newCardValue) {
          console.log('we were dealt a card', newCardValue);
          cardPosAnim.setValue({ x: 0, y: 1 });
          setCard(newCardValue);
          Animated.timing(cardPosAnim, {
            toValue: { x: 0, y: 0 },
            duration: 4000,
            useNativeDriver: true,
          }).start(() => {
            console.log('finished deal cards animation');
            setIsAnimating(false);
          });

          // If new card is undefined, send card up "to trash"
        } else if (!!card && !newCardValue) {
          console.log('our card is being sent to trash');
          Animated.timing(cardPosAnim, {
            toValue: { x: 0, y: 1 },
            duration: 4000,
            useNativeDriver: true,
          }).start(() => {
            setCard(newCardValue);
            console.log('finished send card to trash animation');
            setIsAnimating(false);
          });
          // If both cards are defined, a swap occured
        } else if (players.length > 0) {
          // Figuring out if animating to & from left or right
          const currPlayerIdx = players.findIndex(
            (player) => player.id === currPlayerId,
          );
          const gotTradedWith = currPlayerIdx !== moves.length;
          const x = gotTradedWith ? 1 : -1;

          console.log('begining swap animation');
          Animated.timing(cardPosAnim, {
            toValue: { x, y: 0 },
            duration: 3000,
            useNativeDriver: true,
          }).start(() => {
            setCard(newCardValue);
            Animated.timing(cardPosAnim, {
              toValue: { x: 0, y: 0 },
              duration: 3000,
              useNativeDriver: true,
            }).start(() => {
              console.log('swap animation completed');
              setIsAnimating(false);
            });
          });
        } else {
          setIsAnimating(false);
        }
      } else {
        setIsAnimating(false);
      }
    },
    [card, currPlayerId],
  );

  const [hasMoreInQueue, setHasMoreInQueue] = useState(false);

  const lastGameState = useRef(gameState);
  useEffect(() => {
    console.log(
      'isAnimating',
      isAnimating,
      'hasMoreInQueue',
      hasMoreInQueue,
      'queue.length',
      gameStateHistoryQueue.length,
    );
    if (!isAnimating && hasMoreInQueue) {
      lastGameState.current = gameStateHistoryQueue.shift()!;
      console.log('calling runAnimation with', lastGameState.current);
      runAnimation(lastGameState.current);
      if (gameStateHistoryQueue.length === 0) {
        console.log('CLEARING GAMESTATE');
        setHasMoreInQueue(false);
      }
    } else {
      const currPlayersCard = gameState.players.find(
        (player) => player.id === currPlayerId,
      )?.card;
      console.log('setting card:', currPlayersCard);
      setCard(currPlayersCard);
      currPlayersCard && cardPosAnim.setValue({ x: 0, y: 0 });
    }
  }, [isAnimating, hasMoreInQueue, gameStateHistoryQueue, runAnimation]);

  useEffect(() => {
    const lastRegisteredState =
      gameStateHistoryQueue[gameStateHistoryQueue.length - 1];
    console.log(
      'new gamestate:',
      gameState,
      'last registered gamestate:',
      lastRegisteredState,
    );
    if (
      (!lastRegisteredState && !!gameState) ||
      lastRegisteredState._stateVersion !== gameState._stateVersion
    ) {
      console.log('registering new gamestate');
      gameStateHistoryQueue.push(gameState);
      setHasMoreInQueue(true);
    }
  }, [gameState]);

  return [card, cardPosAnim];
}

export default useCardAnimation;
