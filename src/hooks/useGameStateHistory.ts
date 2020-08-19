import { useEffect, useRef } from 'react';
import { Queue } from '@modi/util';

function useGameStateHistory(gameState: ModiGameState) {
  const gameStateHistory = useRef<Queue<ModiGameState>>(new Queue()).current;

  useEffect(() => {
    if (
      !gameStateHistory.last ||
      gameState._stateVersion > gameStateHistory.last._stateVersion
    ) {
      console.log(
        'registering new state',
        JSON.stringify(gameState, undefined, '  '),
      );
      gameStateHistory.enqueue(gameState);
    }
  }, [gameState]);

  return gameStateHistory;
}

export default useGameStateHistory;
