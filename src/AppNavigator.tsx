import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import env from '@modi/env.json';

import {
  HomeScreenCreator,
  JoinLobbyScreenCreator,
  LobbyScreenCreator,
  GameScreenCreator,
  TestGameScreenLoading,
  SandboxScreen,
} from './factory';

function devRoutes() {
  if (__DEV__) {
    return {
      TestGame: {
        path: 'test-game/:gameId',
        screen: TestGameScreenLoading,
      },
      Sandbox: SandboxScreen,
    };
  }
  return {};
}

/** @todo upgrade to react-navigation v5 */
const AppStack = createStackNavigator(
  {
    Home: {
      path: '',
      screen: HomeScreenCreator,
    },
    Lobby: {
      path: 'lobbies/:lobbyId',
      screen: LobbyScreenCreator,
      params: { lobbyId: undefined },
    },
    Game: {
      path: 'games/:gameId',
      screen: GameScreenCreator,
    },
    ...devRoutes(),
  },
  {
    initialRouteName: env.SANDBOX ? 'Sandbox' : 'Home',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const RootStack = createStackNavigator(
  {
    App: {
      path: '',
      screen: AppStack,
    },
    JoinLobby: {
      path: 'lobbies/join',
      screen: JoinLobbyScreenCreator,
      navigationOptions: {
        cardStyle: { backgroundColor: '#000000', opacity: 0.75 },
        cardOverlayEnabled: true,
      },
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const AppNavigator = createAppContainer(RootStack);
export default AppNavigator;
