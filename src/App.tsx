import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AppStateProvider } from './providers';
import {
  HomeScreenCreator,
  LobbyScreenCreator,
  GameScreenCreator,
  JoinLobbyScreenCreator,
} from '@modi/factory';

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator();

const App = () => {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <RootStack.Navigator mode="modal" headerMode="none">
          <RootStack.Screen name="App">
            {() => (
              <MainStack.Navigator
                screenOptions={{
                  headerShown: false,
                  cardStyle: { opacity: 1 },
                }}
              >
                <MainStack.Screen name="Home" component={HomeScreenCreator} />
                <MainStack.Screen name="Lobby" component={LobbyScreenCreator} />
                <MainStack.Screen name="Game" component={GameScreenCreator} />
              </MainStack.Navigator>
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="JoinLobby"
            component={JoinLobbyScreenCreator}
            options={{
              cardStyle: { backgroundColor: '#000000', opacity: 0.75 },
              cardOverlayEnabled: true,
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
};

export default App;
