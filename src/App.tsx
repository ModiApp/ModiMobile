import React from 'react';

import AppNavigator from './AppNavigator';
import { AppStateProvider } from './providers';
import Config from 'react-native-config';

const App = () => {
  console.log('API_URL=', Config.API_URL);
  return (
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  );
};

export default App;
