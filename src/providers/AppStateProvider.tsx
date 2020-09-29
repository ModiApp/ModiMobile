import React, { createContext, useContext, useMemo } from 'react';
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

const AppStateContext = createContext<AppContextType>([
  createInitialState(),
  createMockAppStateDispatch(),
  false,
]);

const AppStateProvider: React.FC = ({ children }) => {
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
    <AppStateContext.Provider value={[state, appStateDispatch, restored]}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppState() {
  return useContext(AppStateContext);
}

export default AppStateProvider;
