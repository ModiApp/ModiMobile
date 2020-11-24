import React, { useCallback, useState, useEffect } from 'react';
import { ScreenContainer, TextInput, Button } from '@modimobile/ui/components';
import { useAppState } from '@modimobile/hooks';

type ControlledJoinGameScreenProps = MainStackScreenProps<'JoinGame'>;
const ControlledJoinGameScreen: React.FC<ControlledJoinGameScreenProps> = ({
  navigation,
}) => {
  const [gameId, setGameId] = useState('');
  const [playerId, setPlayerId] = useState('');

  const [appState, appDispatch] = useAppState();

  const onJoinGameBtnPressed = useCallback(() => {
    appDispatch.setGameCredentials(gameId, playerId);
    console.log('setting game rceds');
  }, [gameId, playerId]);

  useEffect(() => {
    console.log('game creds changed');
    if (appState.currGameId && appState.gameAccessToken) {
      console.log('navigating!!');
      navigation.navigate('Game', { gameId, accessToken: playerId });
    }
  }, [appState.currGameId, appState.gameAccessToken]);

  return (
    <ScreenContainer>
      <TextInput placeholder="Game PIN" onChangeText={setGameId} />
      <TextInput placeholder="Player ID" onChangeText={setPlayerId} />
      <Button title="Join Game" color="red" onPress={onJoinGameBtnPressed} />
    </ScreenContainer>
  );
};

export default ControlledJoinGameScreen;
