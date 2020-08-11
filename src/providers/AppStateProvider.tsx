import React, { createContext } from 'react';
import { usePersistStorage } from 'react-native-use-persist-storage';

const createInitialState = (): ModiAppState => ({
  username: '',
  currLobbyId: undefined,
  currGameId: undefined,
  gameAccessToken: undefined,
});

const AppContext = createContext<AppContextType>([
  createInitialState(),
  () => new Promise((r) => r()),
]);

export const AppStateProvider: React.FC = ({ children, ...props }) => {
  const [state, setState] = usePersistStorage('@modi', createInitialState, {
    debug: true,
  });

  const updateState = (updates: Partial<ModiAppState>) =>
    setState({ ...state, ...updates });

  return (
    <AppContext.Provider {...props} value={[state, updateState]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
