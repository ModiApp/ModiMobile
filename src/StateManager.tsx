import React, { createContext } from 'react';
import { usePersistStorage } from 'react-native-use-persist-storage';

const createInitialState = (): ModiAppState => ({
  username: '',
  currentLobbyId: undefined,
  currentGameId: undefined,
  authorizedPlayerId: undefined,
});

const AppContext = createContext<AppContextType>([
  createInitialState(),
  () => new Promise(r => r()),
]);

export const AppStateProvider: React.FC = ({ children, ...props }) => {
  const [state, setState] = usePersistStorage('@modi', createInitialState);

  const updateState = (updates: ModiAppState) =>
    setState({ ...state, ...updates });

  return (
    <AppContext.Provider {...props} value={[state, updateState]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
