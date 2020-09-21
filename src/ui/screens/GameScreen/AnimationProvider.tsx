import React, { useCallback, useMemo } from 'react';
import { useGameState } from '@modi/hooks';
import { Animated } from 'react-native';

interface AnimationContextType {
  /** Will be undefined when player at this index has no card */
  cards: (
    | {
        position: Animated.ValueXY;
        rotation: Animated.Value;
      }
    | undefined
  )[];
  labels: {
    position: Animated.ValueXY;
    rotation: Animated.Value;
  }[];
}

function createInitialAnimationContext(): AnimationContextType {
  return {
    cards: [],
    labels: [],
  };
}

const AnimationContext = React.createContext<AnimationContextType>(
  createInitialAnimationContext(),
);

const AnimationProvider: React.FC = ({ children }) => {
  const gamestate = useGameState();

  const animatedValues = useMemo<AnimationContextType>(
    () => ({
      cards: gamestate.players.map((player, idx) =>
        player.card
          ? {
              position: new Animated.ValueXY({ x: 0, y: 0 }),
              rotation: new Animated.Value(0),
            }
          : undefined,
      ),
      labels: gamestate.players.map((player, idx) => ({
        position: new Animated.ValueXY({ x: 0, y: 0 }),
        rotation: new Animated.Value(0),
      })),
    }),
    [gamestate.players.length],
  );

  const getAnimatedValues = useCallback(() => {}, [
    JSON.stringify(gamestate.players),
  ]);

  return (
    <AnimationContext.Provider value={animatedValues}>
      {children}
    </AnimationContext.Provider>
  );
};
