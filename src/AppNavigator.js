import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  HomeScreenCreator,
  JoinLobbyScreenCreator,
  LobbyScreenCreator,
  GameScreenCreator,
} from './factory';

const AppStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreenCreator,
    },
    Lobby: {
      path: 'lobbies/:id',
      screen: LobbyScreenCreator,
    },
    Game: {
      path: 'games/:id',
      screen: GameScreenCreator,
    },
  },
  {
    initialRouteName: 'Game',
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
