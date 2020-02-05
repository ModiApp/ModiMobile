import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { colors } from './ui/styles';
import { HomeScreenCreator, LobbyScreenCreator } from './factory';

const AppStack = createStackNavigator(
  {
    Home: {
      path: '/',
      screen: HomeScreenCreator,
    },
    Lobby: {
      path: '/lobbies/:id',
      screen: LobbyScreenCreator,
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerShown: false,
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.feltGreen,
        borderBottomWidth: 0,
      },
    },
  },
);

const AppContainer = createAppContainer(AppStack);

export default AppContainer;
