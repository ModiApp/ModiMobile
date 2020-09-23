import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Animated } from 'react-native';

import { useGameState, useStateQueue } from '@modi/hooks';

interface AnimatedCard extends Card {
  position: Animated.ValueXY;
  rotation: Animated.Value;
}
interface AnimationContextType {
  cards: (AnimatedCard | undefined)[];
  hitCard: AnimatedCard | undefined;
  /** Positions and rotations of the player name labels */
  labels: {
    position: Animated.ValueXY;
    rotation: Animated.Value;
  }[];
}

function createInitialAnimationContext(): AnimationContextType {
  return {
    cards: [],
    hitCard: undefined,
    labels: [],
  };
}

const AnimationContext = React.createContext<AnimationContextType>(
  createInitialAnimationContext(),
);

const AnimationProvider: React.FC = ({ children }) => {
  const gamestate = useGameState();

  const [isAnimating, setIsAnimating] = useState(false);
  const [lastState, currState] = useStateQueue(gamestate, !isAnimating);
  const stateDiff = useGameStateDiffReader(lastState, currState);

  const animatedValues = useMemo<AnimationContextType>(
    () => ({
      cards: gamestate.players.map((player, idx) =>
        player.card
          ? {
              position: new Animated.ValueXY({ x: 0, y: 0 }),
              rotation: new Animated.Value(0),
              ...player.card,
            }
          : undefined,
      ),
      hitCard: undefined,
      labels: gamestate.players.map((player, idx) => ({
        position: new Animated.ValueXY({ x: 0, y: 0 }),
        rotation: new Animated.Value(0),
      })),
    }),
    [gamestate.players.length],
  );
  const [showAllCards, setShowAllCards] = useState(true);
  const [cardsDisplayed, setCardsDisplayed] = useState<(Card | undefined)[]>(
    [],
  );

  const runDealCardsAnimation = useCallback(() => {
    setIsAnimating(true);
    Animated.parallel(
      animatedValues.cards.map((cardAnimVals, idx) => {
        return !cardAnimVals
          ? Animated.delay(0)
          : Animated.timing(cardAnimVals.position, {
              delay: idx * 200,
              toValue: { x: 0, y: 0 },
              duration: 400,
              useNativeDriver: true,
            });
      }),
    ).start(() => setIsAnimating(false));
  }, [lastState, currState]);

  useEffect(() => {
    if (stateDiff.cardsWereJustDealt) {
      runDealCardsAnimation();
    }
    if (stateDiff.cardsWereJustTrashed) {
      console.log('cards were just trashed');
    }
    if (stateDiff.isPlayingHighcard) {
      !showAllCards && setShowAllCards(true);
    }
    if (stateDiff.dealerJustHitDeck) {
      console.log('dealer just hit deck');
      // last card is lastState.players[lastState.players.length - 1].card
      // new card is currState.players[currState.players.length - 1].card
    }
  }, [stateDiff]);

  return (
    <AnimationContext.Provider value={animatedValues}>
      {children}
    </AnimationContext.Provider>
  );
};

// ============ HOOKS =============

function useGameStateDiffReader(
  lastState: GameStateContextType,
  currState: GameStateContextType,
) {
  return useMemo(() => {
    const cardsOnTable = (state: GameStateContextType) =>
      state.players
        .map((player) => player.card)
        .filter((card) => card !== undefined);
    const alivePlayers = (state: GameStateContextType) =>
      state.players.filter((player) => player.lives > 0);

    return {
      cardsWereJustDealt:
        cardsOnTable(lastState).length === 0 &&
        cardsOnTable(currState).length > 0,
      cardsWereJustTrashed:
        cardsOnTable(lastState).length > 0 &&
        cardsOnTable(currState).length === 0,
      isPlayingHighcard: currState.round === 0,
      dealerJustHitDeck:
        lastState.moves.length === alivePlayers(lastState).length &&
        lastState.moves[lastState.moves.length - 1] === 'swap',
    };
  }, [JSON.stringify(lastState), JSON.stringify(currState)]);
}

// ========== ANIMATIONS ==========
function useDealCardsAnimation(cardAnimationVals: AnimatedCard[]) {
  const [isAnimating, setIsAnimating] = useState(false);
  const runAnimation = useCallback(() => {
    const rotationFactor = (2 * Math.PI) / cardAnimationVals.length;
    const boardRadius = 
  }, [cardAnimationVals]);

  return [isAnimating, runAnimation];
};

export default AnimationProvider;
