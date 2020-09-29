import React, { createContext, useContext, useState, useMemo } from 'react';
import { LayoutRectangle } from 'react-native';

import { range } from '@modi/ui/util';

interface GameScreenLayoutInfo {
  boardWidth: number;
  boardHeight: number;
  cardWidth: number;
  cardHeight: number;
  boardRadius: number;
}

type GameScreenLayoutContext = [
  GameScreenLayoutInfo,
  {
    setBoardLayout: (layout: LayoutRectangle) => void;
    setNumPlayers: (numPlayers: number) => void;
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
    },
    {
      setBoardLayout: () => {},
      setNumPlayers: () => {},
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
  const [numPlayers, setNumPlayers] = useState(0);
  const layout = useMemo<GameScreenLayoutInfo>(() => {
    const cardHeight =
      range(2, 20, 0.32, 0.12, numPlayers) * boardLayout.height;
    const cardWidth = cardHeight / 1.528;
    return {
      boardWidth: boardLayout.width,
      boardHeight: boardLayout.height,
      cardWidth,
      cardHeight,
      boardRadius: 0,
    };
  }, [boardLayout, numPlayers]);

  const layoutDispatch = { setBoardLayout, setNumPlayers };

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
