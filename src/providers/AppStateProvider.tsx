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
  config?: Partial<AppStateDispatch>,
): AppStateDispatch {
  return {
    setUsername: config?.setUsername || Promise.resolve,
    setLobbyId: config?.setLobbyId || Promise.resolve,
    removeLobbyId: config?.removeLobbyId || Promise.resolve,
    setGameCredentials: config?.setGameCredentials || Promise.resolve,
    removeGameCredentials: config?.removeGameCredentials || Promise.resolve,
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
