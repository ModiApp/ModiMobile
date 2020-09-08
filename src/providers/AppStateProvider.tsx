import React, { createContext, useMemo } from 'react';
import { usePersistStorage } from 'react-native-use-persist-storage';

function createInitialState(): ModiAppState {
  return {
    username: '',
    currLobbyId: undefined,
    currGameId: undefined,
    gameAccessToken: undefined,
  };
}
function createMockAppStateDispatch(
  config = {} as Partial<AppStateDispatch>,
): AppStateDispatch {
  return {
    setUsername: Promise.resolve,
    setLobbyId: Promise.resolve,
    removeLobbyId: Promise.resolve,
    setGameCredentials: Promise.resolve,
    removeGameCredentials: Promise.resolve,
    ...config,
  };
}

const AppContext = createContext<AppContextType>([
  createInitialState(),
  createMockAppStateDispatch(),
  false,
]);

export const AppStateProvider: React.FC = ({ children, ...props }) => {
  const [state, setState, restored] = usePersistStorage(
    '@modi',
    createInitialState,
    {
      debug: true,
      persist: true,
    },
  );

  const updateState = (updates: Partial<ModiAppState>) =>
    setState((currState) => ({ ...currState, ...updates }));

  const appStateDispatch = {
    setUsername: (username: string) => updateState({ username }),
    setLobbyId: (currLobbyId: string) => updateState({ currLobbyId }),
    removeLobbyId: () => updateState({ currLobbyId: undefined }),
    setGameCredentials: (currGameId: string, gameAccessToken: string) =>
      updateState({ currGameId, gameAccessToken }),
    removeGameCredentials: () =>
      updateState({ currGameId: undefined, gameAccessToken: undefined }),
  };

  return (
    <AppContext.Provider {...props} value={[state, appStateDispatch, restored]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
