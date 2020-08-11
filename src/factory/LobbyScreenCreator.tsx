import React, { useContext, useEffect, useCallback } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import Share from 'react-native-share';

import AppContext from '../providers/AppStateProvider';
import { LobbyScreen } from '../ui';
import { LobbyStateProvider, LobbyStateContext } from '../providers';
import { validateLobbyId } from '../util';

type NavParams = { lobbyId: string };
const LobbyScreenCreator: NavigationStackScreenComponent<NavParams> = ({
  navigation,
}) => {
  const lobbyId = navigation.getParam('lobbyId');
  const [{ username }, updateState] = useContext(AppContext);

  useEffect(() => {
    lobbyId &&
      validateLobbyId(lobbyId).then((isValid) => {
        if (isValid) {
          updateState({ currLobbyId: lobbyId });
        } else {
          updateState({ currLobbyId: undefined }).then(() =>
            navigation.navigate('Home'),
          );
        }
      });
  }, [lobbyId]);

  const onInviteFriendsBtnPressed = useCallback(() => {
    Share.open({
      message: `Join My Modi Game! modi:/app/lobbies/${lobbyId}`,
    });
  }, []);

  const onUsernameSet = useCallback((newUsername: string) => {
    updateState({ username: newUsername });
  }, []);

  const onEventStarted = useCallback(({ eventId, accessToken }) => {
    updateState({
      currGameId: eventId,
      gameAccessToken: accessToken,
      currLobbyId: undefined,
    });
    navigation.navigate('Game', { gameId: eventId });
  }, []);

  const onBackBtnPressed = useCallback(() => {
    updateState({ currLobbyId: undefined });
    navigation.goBack();
  }, []);

  return (
    <LobbyStateProvider lobbyId={lobbyId} onEventStarted={onEventStarted}>
      <ConnectedLobbyScreen
        lobbyId={lobbyId}
        showUsernameInput={!username || username === ''}
        onUsernameSet={onUsernameSet}
        onInviteFriendsBtnPressed={onInviteFriendsBtnPressed}
        onBackBtnPressed={onBackBtnPressed}
      />
    </LobbyStateProvider>
  );
};

interface ConnectedLobbyScreenProps {
  lobbyId: string;
  showUsernameInput: boolean;
  onUsernameSet: (username: string) => void;
  onInviteFriendsBtnPressed: () => void;
  onBackBtnPressed: () => void;
}
const ConnectedLobbyScreen: React.FC<ConnectedLobbyScreenProps> = ({
  lobbyId,
  showUsernameInput,
  onUsernameSet,
  onInviteFriendsBtnPressed,
  onBackBtnPressed,
}) => {
  const { attendees, currUserId, dispatch } = useContext(LobbyStateContext);

  const dispatchStartGame = useCallback(() => {
    dispatch('START_GAME');
  }, []);

  return (
    <LobbyScreen
      currUserId={currUserId}
      attendees={attendees}
      lobbyId={lobbyId}
      showUsernameInput={showUsernameInput}
      onUsernameSet={onUsernameSet}
      onInviteFriendsBtnPressed={onInviteFriendsBtnPressed}
      onBackBtnPressed={onBackBtnPressed}
      onStartGameBtnPressed={dispatchStartGame}
    />
  );
};

export default LobbyScreenCreator;
