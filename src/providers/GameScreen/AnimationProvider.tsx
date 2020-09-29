import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { Animated } from 'react-native';

import { useStateQueue } from '@modi/hooks';
import { groupSort } from '@modi/util';
import { useGameState } from '@modi/providers/GameScreen';

import { useGameScreenLayout } from './LayoutProvider';

type PlaceholderBorderColor = 'red' | 'yellow' | 'green' | 'none';
interface CardPlaceholder {
  /** translation from center of card map */
  position: { x: number; y: number };
  width: number;
  height: number;
  rotation: number;
  borderColor: PlaceholderBorderColor;
}

interface DisplayedCard extends Card {
  faceUp: boolean;
}
interface AnimatedCard extends DisplayedCard {
  position: Animated.ValueXY;
  rotation: Animated.Value;
}
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
          position: {
            x: Math.cos(cardRotation) * radiusFromMidCard,
            y: Math.sin(cardRotation) * radiusFromMidCard,
          },
          width: cardWidth,
          height: cardHeight,
          rotation: cardRotation,
          borderColor: 'none',
        };
      }),
    );
    setCardsOnScreen(Array(gamestate.players.length).fill(null));
  }, [gamestate.players.length]);

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
        stateDiff.currState.players.map((player) => ({
          ...player.card!,
          faceUp:
            stateDiff.isPlayingHighcard ||
            player.id === stateDiff.currState.me!.id,
        })),
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
  return useMemo(() => {
    const cardsOnTable = (state: GameStateContextType) =>
      state.players
        .map((player) => player.card)
        .filter((card) => card !== undefined);
    const alivePlayers = (state: GameStateContextType) =>
      state.players.filter((player) => player.lives > 0);

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
        lastState.moves.length === alivePlayers(lastState).length &&
        lastState.moves[lastState.moves.length - 1] === 'swap',

      // For convenience
      currState,
      lastState,
    };
  }, [JSON.stringify(lastState), JSON.stringify(currState)]);
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

      Animated.parallel(
        cardAnimationVals.map((cardVal, idx) => {
          const cardRotation = rotationFactor * idx + Math.PI / 2;
          return Animated.parallel([
            Animated.timing(cardVal.position, {
              delay: 200 * idx,
              duration: 400,
              toValue: {
                x: Math.cos(cardRotation) * boardRadius,
                y: Math.sin(cardRotation) * boardRadius,
              },
              useNativeDriver: true,
            }),
            Animated.timing(cardVal.rotation, {
              delay: 200 * idx,
              duration: 400,
              toValue: cardRotation,
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

export function useGameScreenAnimations() {
  return useContext(AnimationContext);
}

export default AnimationProvider;
