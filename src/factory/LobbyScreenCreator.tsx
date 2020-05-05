import React, { useContext, useEffect, useCallback } from 'react';
import Share from 'react-native-share';

import { LobbyScreen } from '../ui';
import AppContext from '../StateManager';
import { LobbyService } from '../service';

const LobbyScreenCreator = ({ navigation }) => {
  const lobbyId = navigation.getParam('id');
  const [{ username }, updateState] = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const lobbyExists = await LobbyService.isLobbyIdValid(lobbyId);
      updateState({ currentLobbyId: lobbyExists ? lobbyId : undefined });
      !lobbyExists && navigation.goBack();
    })();
  }, [lobbyId]);

  // When user presses 'Invite Friends' button
  const openShareTab = () =>
    Share.open({
      message: `Join My Modi Game! modi:/app/lobbies/${lobbyId}`,
    });

  const onEventStarted = useCallback(({ eventId, authorizedPlayerId }) => {
    updateState({
      currentGameId: eventId,
      authorizedPlayerId,
      currentLobbyId: undefined,
    });
    navigation.navigate('Game', { param: { id: eventId } });
  }, []);

  const {
    connectedPlayers,
    currentPlayer,
    lobbyLeader,
    sendMessageToLobbyNsp,
  } = LobbyService.useLobbyConnection(lobbyId, username, onEventStarted);

  // When lobby creator presses 'start game' button
  const triggerStartEvent = () => sendMessageToLobbyNsp('start');

  return (
    <LobbyScreen
      gamePin={lobbyId}
      lobbyCreator={lobbyLeader}
      currentPlayer={currentPlayer}
      connectedPlayers={connectedPlayers}
      askForUsername={!username || username === ''}
      onUsernameSet={u => updateState({ username: u })}
      onInviteFriendsBtnPressed={openShareTab}
      onStartGameBtnPressed={triggerStartEvent}
      onBackBtnPressed={navigation.goBack}
    />
  );
};

export default LobbyScreenCreator;
