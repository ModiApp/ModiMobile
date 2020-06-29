import React, { useEffect, useContext, useReducer } from 'react';
import { Animated } from 'react-native';
import {
  NavigationScreenProp,
  NavigationScreenComponent,
} from 'react-navigation';

import { GameScreen } from '../ui';
import GameService, { createMockGameService } from '../service/GameService';
import AppContext from '../StateManager';

const initialGameState: ModiGameState = {
  round: 0,
  dealerId: '',
  activePlayerIdx: 0,
  playersCards: new Map(),
  moves: [],
  liveCounts: [],
  cardOrder: [1, 2, 3, 4, 5, 6],
  playerOrder: [],
};

const gameStateReducer: React.Reducer<ModiGameState, GameStateChangeAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'set entire state':
      return { ...action.payload };
    case 'card order changed':
      return { ...state, cardOrder: action.payload };
    case 'live counts changed':
      return { ...state, liveCounts: action.payload };
    case 'player order changed':
      return { ...state, playerOrder: action.payload };
    default:
      return state;
  }
};

const GameScreenCreator: React.FC<{
  gameId: string;
  username: string;
  authorizedPlayerId: string;
}> = ({ gameId, username, authorizedPlayerId }) => {
  const [gameState, dispatchGameStateChangeAction] = useReducer(
    gameStateReducer,
    initialGameState,
  );

  useEffect(() => {
    const gameConnection = createMockGameService({
      gameId,
      authorizedPlayerId,
      username,
      onGameStateChanged: dispatchGameStateChangeAction,
    });
    return () => gameConnection.disconnect();
  }, []);

  return <GameScreen gameState={gameState} />;
};

export default ({
  navigation,
}: {
  navigation: NavigationScreenProp<{}, { id: string }>;
}) => {
  const [globalState, updateGlobalState] = useContext(AppContext);
  const { username, authorizedPlayerId } = globalState;
  const gameId = navigation.getParam('id');
  useEffect(() => {
    (async () => {
      const isValid = await GameService.isGameIdValid(gameId);
      if (!isValid) {
        updateGlobalState({
          authorizedPlayerId: undefined,
          currentGameId: undefined,
        });
        navigation.navigate('Home');
      }
    })();
  }, [gameId]);

  return (
    <GameScreenCreator
      gameId={gameId}
      username={username!}
      authorizedPlayerId={authorizedPlayerId!}
    />
  );
};

// const createGameScreenWithCredentials
