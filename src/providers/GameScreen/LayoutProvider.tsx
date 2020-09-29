import React, { createContext, useContext, useState, useMemo } from 'react';
import { LayoutRectangle } from 'react-native';

import { range } from '@modi/ui/util';
import { useGameState } from '@modi/providers';

interface GameScreenLayoutInfo {
  boardWidth: number;
  boardHeight: number;
  cardWidth: number;
  cardHeight: number;
  boardRadius: number;
  boardRotation: number;
}

type GameScreenLayoutContext = [
  GameScreenLayoutInfo,
  {
    setBoardLayout: (layout: LayoutRectangle) => void;
  },
];

function createInitialLayoutContext(): GameScreenLayoutContext {
  return [
    {
      boardWidth: 0,
      boardHeight: 0,
      cardWidth: 0,
      cardHeight: 0,
      boardRadius: 0,
      boardRotation: 0,
    },
    {
      setBoardLayout: () => {},
    },
  ];
}
const GameScreenLayoutContext = createContext(createInitialLayoutContext());
const GameScreenLayoutProvider: React.FC = ({ children }) => {
  const [boardLayout, setBoardLayout] = useState<LayoutRectangle>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const { me, players } = useGameState();

  const layout = useMemo<GameScreenLayoutInfo>(() => {
    const cardHeight =
      range(2, 20, 0.32, 0.12, players.length) * boardLayout.height;
    const cardWidth = cardHeight / 1.528;

    const rotation = (2 * Math.PI) / (players.length || 1);
    const idxOfMe = players.findIndex((player) => player.id === me?.id);
    const boardRotation = -idxOfMe * rotation;
    return {
      boardWidth: boardLayout.width,
      boardHeight: boardLayout.height,
      cardWidth,
      cardHeight,
      boardRadius: 0,
      boardRotation,
    };
  }, [boardLayout, players.length, me]);

  const layoutDispatch = { setBoardLayout };

  return (
    <GameScreenLayoutContext.Provider value={[layout, layoutDispatch]}>
      {children}
    </GameScreenLayoutContext.Provider>
  );
};

export function useGameScreenLayout() {
  return useContext(GameScreenLayoutContext);
}

export default GameScreenLayoutProvider;
