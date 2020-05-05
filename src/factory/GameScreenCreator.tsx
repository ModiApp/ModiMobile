import React, { useEffect, useContext } from 'react';

import { GameScreen } from '../ui';
import GameService from '../service/GameService';
import AppContext from '../StateManager';

const GameScreenCreator = ({ navigation }) => {
  const [globalState, updateGlobalState] = useContext(AppContext);
  const { authorizedPlayerId, username } = globalState;
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

  const { waitingForPlayers, connectedPlayers } = GameService.useGameConnection(
    gameId,
    authorizedPlayerId,
    username,
  );

  return (
    <GameScreen
      connectedPlayers={connectedPlayers}
      currentPlayerId={authorizedPlayerId}
      isWaitingForPlayers={waitingForPlayers}
    />
  );
};

export default GameScreenCreator;
