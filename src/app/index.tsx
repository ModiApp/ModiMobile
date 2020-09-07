import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  NavigationContainer,
  useFocusEffect,
  NavigationState,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  LobbyScreenCreator,
  GameScreenCreator,
  ControlledJoinLobbyScreen,
  ControlledHomeScreen,
} from '@modi/factory';

import { AppStateProvider } from '@modi/providers';
import { useAppState } from '@modi/hooks';
import { validateGameId, validateLobbyId } from '@modi/util';

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [appState, appStateDispatch, restored] = useAppState();

  const [isMounted, setIsMounted] = useState(false);
  const didInitialRun = useRef(false);
  useEffect(() => {
    if (isMounted && restored && !didInitialRun.current) {
      console.log('App mounted with state:', appState);
      runRouteMiddlewares();
      didInitialRun.current = true;
    }
  }, [isMounted, restored]);

  const runRouteMiddlewares = useCallback(
    (state?: NavigationState | undefined) => {
      const routeName = navigationRef.current?.getCurrentRoute()
        ?.name as RouteName;
      const routeParams = navigationRef.current?.getCurrentRoute()?.params;
      console.log('NAV STATE CHANGED', state);
      const routeMiddlewares = {
        Home: () => {
          console.log('home middleware hit');
          if (appState.currGameId && appState.gameAccessToken) {
            validateGameId(appState.currGameId).then((isValid) =>
              isValid
                ? navigationRef.current?.navigate('Game')
                : appStateDispatch.removeGameCredentials(),
            );
          }
          if (appState.currLobbyId) {
            validateLobbyId(appState.currLobbyId).then((isValid) =>
              isValid
                ? navigationRef.current?.navigate('Lobby', {
                    lobbyId: appState.currLobbyId,
                  })
                : appStateDispatch.removeLobbyId(),
            );
          }
        },
        Lobby: () => {
          console.log('lobby middleware hit');
          // @ts-ignore
          const lobbyId = routeParams?.lobbyId || appState.currLobbyId;
          if (lobbyId) {
            validateLobbyId(lobbyId).then((isValid) => {
              if (!isValid) {
                appStateDispatch.removeLobbyId().then(() => {
                  navigationRef.current?.navigate('Home');
                });
              } else if (appState.currLobbyId !== lobbyId) {
                appStateDispatch.setLobbyId(lobbyId);
              }
            });
          } else {
            navigationRef.current?.navigate('Home');
          }
        },
        Game: () => {
          // @ts-ignore
          const gameId = routeParams?.gameId || appState.currGameId;

          const accessToken =
            // @ts-ignore
            routeParams?.accessToken || appState.gameAccessToken;

          if (gameId && accessToken) {
            validateGameId(gameId).then((isValid) => {
              if (isValid) {
                appStateDispatch.setGameCredentials(gameId, accessToken);
              } else {
                appStateDispatch.removeGameCredentials();
                navigationRef.current?.navigate('Home');
              }
            });
          } else {
            navigationRef.current?.navigate('Home');
          }
        },
        JoinLobby: () => {},
      };

      routeName && routeMiddlewares[routeName]();
    },
    [appState, appStateDispatch],
  );

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        prefixes: ['modi://'],
        config: {
          screens: {
            Home: '',
            JoinLobby: 'lobbies/join',
            Lobby: 'lobbies/:lobbyId',
            Game: 'games/:gameId',
          },
        },
      }}
      onStateChange={runRouteMiddlewares}
      onReady={() => setIsMounted(true)}
    >
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="App">
          {() => (
            <MainStack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { opacity: 1 },
              }}
            >
              <MainStack.Screen name="Home" component={ControlledHomeScreen} />
              <MainStack.Screen name="Lobby" component={LobbyScreenCreator} />
              <MainStack.Screen name="Game" component={GameScreenCreator} />
            </MainStack.Navigator>
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="JoinLobby"
          component={ControlledJoinLobbyScreen}
          options={{
            cardStyle: { backgroundColor: '#000000', opacity: 0.75 },
            cardOverlayEnabled: true,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => (
  <AppStateProvider>
    <AppNavigator />
  </AppStateProvider>
);

export default App;
