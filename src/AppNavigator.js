import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { HomeScreenCreator, LobbyScreenCreator } from './factory';

const AppStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreenCreator,
    },
    Lobby: {
      path: 'lobbies/:id',
      screen: LobbyScreenCreator,
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const AppNavigator = createAppContainer(AppStack);
export default AppNavigator;
