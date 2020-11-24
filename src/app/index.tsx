import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  NavigationContainer,
  useFocusEffect,
  NavigationState,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  LobbyScreenCreator,
  ControlledGameScreen,
  ControlledJoinLobbyScreen,
  ControlledHomeScreen,
} from '@modimobile/factory';

import { AppStateProvider } from '@modimobile/providers';
import { useAppState } from '@modimobile/hooks';
import { validateGameId, validateLobbyId } from '@modimobile/util';

const MainStack = createStackNavigator<MainStackParams>();
const RootStack = createStackNavigator();

function MainStackNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { opacity: 1 },
      }}
    >
      <MainStack.Screen name="Home" component={ControlledHomeScreen} />
      <MainStack.Screen name="Lobby" component={LobbyScreenCreator} />
      <MainStack.Screen name="Game" component={ControlledGameScreen} />
    </MainStack.Navigator>
  );
}

const AppNavigator: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const routeNameRef = useRef<string>();
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
      const goHome = () =>
        navigationRef.current?.dispatch(StackActions.popToTop());
      const routeMiddlewares: { [key in RouteName]: () => any } = {
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
          // @ts-ignore
          const lobbyId = routeParams?.lobbyId || appState.currLobbyId;
          if (lobbyId) {
            validateLobbyId(lobbyId).then((isValid) => {
              if (!isValid) {
                appStateDispatch.removeLobbyId().then(goHome);
              } else if (appState.currLobbyId !== lobbyId) {
                appStateDispatch.setLobbyId(lobbyId);
              }
            });
          } else {
            goHome();
          }
        },
        Game: () => {
          // @ts-ignore
          console.log('route params', routeParams);
          console.log(appState.currGameId, appState.gameAccessToken);
          // const gameId = routeParams?.gameId || appState.currGameId;

          // const accessToken =
          //   // @ts-ignore
          //   routeParams?.accessToken || appState.gameAccessToken;

          const { gameId, accessToken } = (() => {
            // @ts-ignore
            if (routeParams?.gameId && routeParams?.accessToken) {
              return {
                // @ts-ignore
                gameId: routeParams.gameId,
                // @ts-ignore
                accessToken: routeParams.accessToken,
              };
            }
            return {
              gameId: appState.currGameId,
              accessToken: appState.gameAccessToken,
            };
          })();
          console.log('new credentials:', gameId, accessToken);
          if (gameId && accessToken) {
            validateGameId(gameId).then((isValid) => {
              if (isValid) {
                appStateDispatch
                  .setGameCredentials(gameId, accessToken)
                  .then(() => {
                    console.log(
                      'updated app state game credentials',
                      gameId,
                      accessToken,
                    );
                  });
                navigationRef.current?.setParams({ gameId, accessToken });
              } else {
                navigationRef.current?.setParams({
                  gameId: undefined,
                  accessToken: undefined,
                });
                appStateDispatch.removeGameCredentials();
                goHome();
              }
            });
          } else {
            goHome();
          }
        },
        JoinLobby: () => {},
        JoinGame: () => {},
      };

      if (routeName && routeName !== routeNameRef.current) {
        routeNameRef.current = routeName;
        routeMiddlewares[routeName]();
      }
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
        <RootStack.Screen name="App" component={MainStackNavigator} />
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
