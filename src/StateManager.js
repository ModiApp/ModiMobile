import React, { createContext } from 'react';
import { usePersistStorage } from 'react-native-use-persist-storage';

const createInitialState = () => ({
  username: '',
  game: undefined,
});

const AppContext = createContext();

export const AppStateProvider = ({ children, ...props }) => {
  const [state, setState, restored] = usePersistStorage(
    '@modi',
    createInitialState,
  );
  const updateState = updates => setState({ ...state, ...updates });
  return (
    <AppContext.Provider {...props} value={[state, updateState]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
