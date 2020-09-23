import React, { createContext, useContext, useState, useMemo } from 'react';

interface GameScreenLayoutInfo {
  screenWidth: number;
  screenHeight: number;
  cardWidth: number;
  cardHeight: number;
  boardRadius: number;
}

interface GameScreenContextType extends GameScreenLayoutInfo {
  setScreenLayout: (layout: { width: number; height: number }) => void;
}

function createInitialLayoutContext(
  defaults = {} as Partial<GameScreenContextType>,
): GameScreenContextType {
  return {
    screenWidth: 0,
    screenHeight: 0,
    cardWidth: 0,
    cardHeight: 0,
    boardRadius: 0,
    setScreenLayout: () => {},
    ...defaults,
  };
}
const GameScreenLayoutContext = createContext(createInitialLayoutContext());
const GameScreenLayoutProvider: React.FC = ({ children }) => {
  const [screenLayout, setScreenLayout] = useState({ width: 0, height: 0 });
  const layout = useMemo<GameScreenContextType>(() => {
    return {
      screenWidth: screenLayout.width,
      screenHeight: screenLayout.height,
      cardWidth: 0,
      cardHeight: 0,
      boardRadius: 0,
      setScreenLayout,
    };
  }, [screenLayout]);
  return (
    <GameScreenLayoutContext.Provider value={layout}>
      {children}
    </GameScreenLayoutContext.Provider>
  );
};

export function useGameScreenLayout() {
  return useContext(GameScreenLayoutContext);
}

export default GameScreenLayoutProvider;
