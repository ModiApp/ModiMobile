import React from 'react';
import { useContext } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { AppStateContext } from '../providers';
import { ScreenContainer } from '../ui/components';

const TestGameScreenLoadingScreen: NavigationStackScreenComponent<{
  gameId: string;
  accessToken: string;
}> = ({ navigation }) => {
  const gameId = navigation.getParam('gameId');
  const accessToken = navigation.getParam('accessToken');

  const [_, updateGlobalState] = useContext(AppStateContext);

  if (gameId && accessToken) {
    updateGlobalState({
      currGameId: gameId,
      currLobbyId: undefined,
      gameAccessToken: accessToken,
    });
  } else {
    console.log('couldnt setup test-game because params were undefined');
  }

  navigation.navigate('Home');

  return <ScreenContainer />;
};

export default TestGameScreenLoadingScreen;
