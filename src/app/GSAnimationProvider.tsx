/** @ts-ignore all */
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { Animated } from 'react-native';

import { useStateQueue } from '@modi/hooks';
// import { useGameState } from '@modi/providers/GameScreen';

// import { useGameScreenLayout } from './LayoutProvider';

type PlaceholderBorderColor = 'red' | 'yellow' | 'green' | 'none';
interface CardPlaceholder extends AnimatedObject {
  width: number;
  height: number;
  borderColor: PlaceholderBorderColor;
}
interface AnimatedObject {
  /** Translates from midpoint of CardMap */
  position: Animated.ValueXY;
  rotation: Animated.Value;
}

interface DisplayedCard extends Card {
  faceUp: boolean;
}
interface AnimatedCard extends DisplayedCard, AnimatedObject {}
interface AnimationContextType {
  cards: (AnimatedCard | null)[];
  placeholders: CardPlaceholder[];
  hitCard: AnimatedCard | null;
}

function createInitialAnimationContext(): AnimationContextType {
  return {
    cards: [],
    placeholders: [],
    hitCard: null,
  };
}

export const AnimationContext = React.createContext<AnimationContextType>(
  createInitialAnimationContext(),
);

const AnimationProvider: React.FC = ({ children }) => {
  const gamestate = useGameState();
  const [{ boardHeight, cardHeight, cardWidth }] = useGameScreenLayout();

  const [isAnimating, setIsAnimating] = useState(false);
  const [lastState, currState] = useStateQueue(gamestate, !isAnimating);
  const stateDiff = useGameStateDiffReader(lastState, currState);

  const [hitCard, setHitCard] = useState<AnimatedCard | null>(null);
  const [cardPlaceholders, setCardPlaceholders] = useState<CardPlaceholder[]>(
    [],
  );

  useEffect(() => {
    const rotateFactor = (2 * Math.PI) / gamestate.players.length;
    const radiusFromMidCard = (boardHeight - cardHeight - 20) / 2;

    setCardPlaceholders(
      gamestate.players.map((_, idx) => {
        const cardRotation = rotateFactor * idx + Math.PI / 2;
        return {
          position: new Animated.ValueXY({
            x: Math.cos(cardRotation) * radiusFromMidCard,
            y: Math.sin(cardRotation) * radiusFromMidCard,
          }),
          width: cardWidth,
          height: cardHeight,
          rotation: new Animated.Value(cardRotation - Math.PI / 2),
          borderColor: 'none',
        };
      }),
    );
    setCardsOnScreen(Array(gamestate.players.length).fill(null));
  }, [gamestate.players.length, cardHeight, boardHeight]);

  const cardAnimationVals = useMemo(() => {
    return gamestate.players.map(() => ({
      position: new Animated.ValueXY({ x: 0, y: 0 }),
      rotation: new Animated.Value(0),
    }));
  }, [gamestate.players.length]);

  const [cardsOnScreen, setCardsOnScreen] = useState<(DisplayedCard | null)[]>(
    [],
  );

  const animatedCards = useMemo<(AnimatedCard | null)[]>(() => {
    return cardsOnScreen.map((card, idx) =>
      !card ? null : { ...cardAnimationVals[idx], ...card },
    );
  }, [cardsOnScreen, cardAnimationVals]);

  const animationContextValue = useMemo(
    () => ({
      cards: animatedCards,
      hitCard: hitCard,
      placeholders: cardPlaceholders,
    }),
    [animatedCards, hitCard, cardPlaceholders],
  );

  const animateDealingCards = useDealCardsAnimation(
    cardAnimationVals,
    boardHeight,
    cardHeight,
  );

  const animateSendCardsToTrash = useTrashCardsAnimation(
    cardAnimationVals,
    boardHeight,
  );

  const animateCardsTrading = useTradePlacesAnimation(
    cardAnimationVals,
    boardHeight,
    cardHeight,
  );

  const changePlaceholderBorderColors = useCallback(
    (idxs: number[], color: 'red' | 'yellow' | 'green' | 'none') => {
      setCardPlaceholders((placeholders) =>
        placeholders.map((placeholder, idx) => ({
          ...placeholder,
          borderColor: idxs.includes(idx) ? color : placeholder.borderColor,
        })),
      );
    },
    [],
  );

  const handleEndOfHighcardRound = useCallback(
    (state: ModiGameState, onComplete?: () => void) => {
      const players = state.players;
      const rankedPlayers = groupSort(players, (player) => player.card!.rank);
      const winners = rankedPlayers[rankedPlayers.length - 1];
      const winenerIdxs = winners.map((winner) => players.indexOf(winner));
      changePlaceholderBorderColors(winenerIdxs, 'green');
      setTimeout(() => {
        changePlaceholderBorderColors(winenerIdxs, 'none');
        animateSendCardsToTrash(onComplete);
      }, 3000);
    },
    [],
  );

  const handleEndOfRound = useCallback(
    (state: ModiGameState, onComplete?: () => void) => {
      const players = state.players;
      const [losers] = groupSort(players, (player) => player.card?.rank || 14);
      const idxsOfLosers = losers.map((loser) => players.indexOf(loser));
      changePlaceholderBorderColors(idxsOfLosers, 'red');
      setTimeout(() => {
        changePlaceholderBorderColors(idxsOfLosers, 'none');
        animateSendCardsToTrash(onComplete);
      }, 3000);
    },
    [changePlaceholderBorderColors, animateSendCardsToTrash],
  );

  const handleDealerHitCard = useCallback(
    (card: Card, onComplete?: () => void) => {
      const newHitCard = {
        position: new Animated.ValueXY({ x: 0, y: -boardHeight }),
        rotation: new Animated.Value(0),
        faceUp: true,
        ...card,
      };
      setHitCard(newHitCard);
      const boardRadius = (boardHeight - cardHeight - 20) / 2;
      Animated.timing(newHitCard.position, {
        toValue: {
          x: -16,
          y: boardRadius + 8,
        },
        duration: 500,
        useNativeDriver: true,
      }).start(onComplete);
    },
    [gamestate.players.length, boardHeight, cardHeight],
  );

  useEffect(() => {
    if (stateDiff.cardsWereJustDealt) {
      setIsAnimating(true);
      setCardsOnScreen(
        stateDiff.currState.players.map((player) => {
          return player.card
            ? {
                ...player.card,
                faceUp:
                  stateDiff.isPlayingHighcard ||
                  player.id === stateDiff.currState.me!.id,
              }
            : null;
        }),
      );
      animateDealingCards(() => {
        if (stateDiff.isPlayingHighcard) {
          handleEndOfHighcardRound(stateDiff.currState, () =>
            setIsAnimating(false),
          );
        } else {
          setIsAnimating(false);
        }
      });
    }
    if (stateDiff.playersTradedCards) {
      setIsAnimating(true);
      const [fromIdx, toIdx] = stateDiff.tradeIdxs.sort();
      animateCardsTrading(
        fromIdx!,
        toIdx!,
        () =>
          setCardsOnScreen((cards) =>
            cards.map((card, idx) => {
              const prevCard = cards[fromIdx!]!;
              const nextCard = cards[toIdx!]!;
              if (idx === fromIdx) {
                return { ...nextCard, faceUp: prevCard.faceUp };
              }
              if (idx === toIdx) {
                return { ...prevCard, faceUp: nextCard.faceUp };
              }
              return card;
            }),
          ),
        () => setIsAnimating(false),
      );
    }
    if (stateDiff.cardsWereJustTrashed) {
      setIsAnimating(true);
      handleEndOfRound(stateDiff.lastState, () => {
        setCardsOnScreen((cards) => Array(cards.length).fill(null));
        setIsAnimating(false);
      });
    }
    if (stateDiff.dealerJustHitDeck) {
      setIsAnimating(true);
      const playersWithCards = stateDiff.currState.players.filter(
        (player) => !!player.card,
      );
      const dealer = playersWithCards[playersWithCards.length - 1];
      handleDealerHitCard(dealer.card!, () => setIsAnimating(false));
    }
  }, [stateDiff]);

  return (
    <AnimationContext.Provider value={animationContextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

// ============ HOOKS =============

function useGameStateDiffReader(
  lastState: GameStateContextType,
  currState: GameStateContextType,
) {
  const gameStateDiff = useMemo(() => {
    const cardsOnTable = (state: GameStateContextType) =>
      state.players
        .map((player) => player.card)
        .filter((card) => card !== undefined);
    const alivePlayers = (state: GameStateContextType) =>
      state.players.filter((player) => player.lives > 0);

    const lastStatePlayers = alivePlayers(lastState);
    const currStatePlayers = alivePlayers(currState);

    const tradeCardsInfo = () => {
      const playersOgCards = lastState.players
        .map((player) => player.card)
        .filter((card) => !!card);
      const playersNewCards = currState.players
        .map((player) => player.card)
        .filter((card) => !!card);
      if (!playersOgCards.length || !playersNewCards.length) {
        return {
          playersTradedCards: false,
          tradeIdxs: [],
        };
      }
      const diffs = playersOgCards
        .map((card, idx) => {
          if (JSON.stringify(playersNewCards[idx]) !== JSON.stringify(card)) {
            return idx;
          }
          return undefined;
        })
        .filter((idx) => idx !== undefined);

      if (diffs.length === 2) {
        return {
          playersTradedCards: true,
          tradeIdxs: diffs,
        };
      }
      return {
        playersTradedCards: false,
        tradeIdxs: [],
      };
    };

    return {
      /** lastState players didn't have cards, currState players have cards */
      cardsWereJustDealt:
        cardsOnTable(lastState).length === 0 &&
        cardsOnTable(currState).length > 0,
      /** lastState players had cards, currState noone has cards */
      cardsWereJustTrashed:
        cardsOnTable(lastState).length > 0 &&
        cardsOnTable(currState).length === 0,

      /** only true in begining of game, round = 0 */
      isPlayingHighcard: currState.round === 0,

      /** dealers card at lastState is different from currState */
      dealerJustHitDeck:
        lastState.moves.length === lastStatePlayers.length &&
        lastState.moves[lastState.moves.length - 1] === 'swap' &&
        lastStatePlayers[lastStatePlayers.length - 1].card! !==
          currStatePlayers[currStatePlayers.length - 1].card,

      ...tradeCardsInfo(),
      // For convenience
      currState,
      lastState,
    };
  }, [JSON.stringify(lastState), JSON.stringify(currState)]);
  return gameStateDiff;
}

// ========== ANIMATIONS ==========
function useDealCardsAnimation(
  cardAnimationVals: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
  cardHeight: number,
) {
  return useCallback(
    (onComplete?: () => void) => {
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

function useTrashCardsAnimation(
  cardAnimationVals: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
) {
  return useCallback(
    (onComplete?: () => void) => {
      Animated.parallel(
        cardAnimationVals.map(({ position, rotation }, idx) => {
          return Animated.parallel([
            Animated.timing(position, {
              delay: 150 * idx,
              toValue: { x: 0, y: -boardHeight },
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(rotation, {
              delay: 150 * idx,
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]);
        }),
      ).start(onComplete);
    },
    [cardAnimationVals, boardHeight],
  );
}
function useTradePlacesAnimation(
  animationVals: AnimatedObject[],
  boardHeight: number,
  cardHeight: number,
) {
  return useCallback(
    (
      fromIdx: number,
      toIdx: number,
      onSwap?: () => void,
      onComplete?: () => void,
    ) => {
      const rotationFactor = (2 * Math.PI) / animationVals.length;
      const boardRadius = (boardHeight - cardHeight - 20) / 2;
      const fromVal = {
        position: {
          x: Math.cos(rotationFactor * fromIdx + Math.PI / 2) * boardRadius,
          y: Math.sin(rotationFactor * fromIdx + Math.PI / 2) * boardRadius,
        },
        rotation: normalizeAngle(rotationFactor * fromIdx),
      };
      const toVal = {
        position: {
          x: Math.cos(rotationFactor * toIdx + Math.PI / 2) * boardRadius,
          y: Math.sin(rotationFactor * toIdx + Math.PI / 2) * boardRadius,
        },
        rotation: normalizeAngle(rotationFactor * toIdx),
      };
      const meetPoint = {
        position: {
          x:
            ((toVal.position.x - fromVal.position.x) * 2) / 3 +
            fromVal.position.x,
          y:
            ((toVal.position.y - fromVal.position.y) * 2) / 3 +
            fromVal.position.y,
        },
        rotation:
          ((toVal.rotation - fromVal.rotation) * 2) / 3 + fromVal.rotation,
      };

      Animated.parallel([
        Animated.timing(animationVals[fromIdx].position, {
          duration: 600,
          toValue: meetPoint.position,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[fromIdx].rotation, {
          duration: 600,
          toValue: meetPoint.rotation,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[toIdx].position, {
          delay: 400,
          duration: 200,
          toValue: meetPoint.position,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[toIdx].rotation, {
          delay: 400,
          duration: 200,
          toValue: meetPoint.rotation,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onSwap && onSwap();
        Animated.parallel([
          Animated.timing(animationVals[fromIdx].position, {
            duration: 300,
            toValue: fromVal.position,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[fromIdx].rotation, {
            duration: 300,
            toValue: fromVal.rotation,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[toIdx].position, {
            duration: 100,
            toValue: toVal.position,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[toIdx].rotation, {
            duration: 100,
            toValue: toVal.rotation,
            useNativeDriver: true,
          }),
        ]).start(onComplete);
      });
    },
    [animationVals, boardHeight, cardHeight],
  );
}

/** Takes a fromRotation radians value, this is like the zero
 * Takes a toRotation raidans value,
 */

function normalizeAngle(angle: number) {
  let newAngle = angle % Math.PI;

  newAngle = (newAngle + Math.PI * 2) % (Math.PI * 2);
  if (newAngle > Math.PI) newAngle -= Math.PI * 2;

  return newAngle;
}

export function useGameScreenAnimations() {
  return useContext(AnimationContext);
}

export default AnimationProvider;
