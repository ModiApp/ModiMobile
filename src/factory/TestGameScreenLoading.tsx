import React from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { useAppState } from '@modi/hooks';
import { ScreenContainer } from '@modi/ui/components';

const TestGameScreenLoadingScreen: NavigationStackScreenComponent<{
  gameId: string;
  accessToken: string;
}> = ({ navigation }) => {
  const gameId = navigation.getParam('gameId');
  const accessToken = navigation.getParam('accessToken');

  const [_, updateGlobalState] = useAppState();

  if (gameId && accessToken) {
    updateGlobalState({
      currGameId: gameId,
      currLobbyId: undefined,
      gameAccessToken: accessToken,
    });
  } else {
    console.warn('couldnt setup test-game because params were undefined');
  }

  navigation.navigate('Home');

  return <ScreenContainer />;
};

export default TestGameScreenLoadingScreen;
