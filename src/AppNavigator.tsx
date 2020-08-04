import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  HomeScreenCreator,
  JoinLobbyScreenCreator,
  LobbyScreenCreator,
  GameScreenCreator,
} from './factory';

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
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const RootStack = createStackNavigator(
  {
    App: {
      path: 'app',
      screen: AppStack,
    },
    JoinLobby: {
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
