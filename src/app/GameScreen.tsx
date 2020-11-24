import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ControlledHomeScreen,
  ControlledGameScreen,
  ControlledJoinGameScreen,
} from '@modimobile/factory';
import { AppStateProvider } from '@modimobile/providers';

const MainStack = createStackNavigator<MainStackParams>();

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <MainStack.Navigator>
          <MainStack.Screen name="Home" component={ControlledHomeScreen} />
          <MainStack.Screen
            name="JoinLobby"
            component={ControlledJoinGameScreen}
          />
          <MainStack.Screen name="Game" component={ControlledGameScreen} />
        </MainStack.Navigator>
      </NavigationContainer>
    </AppStateProvider>
  );
};
export default App;
