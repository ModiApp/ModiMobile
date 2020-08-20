import React from 'react';

import AppNavigator from './AppNavigator';
import { AppStateProvider } from './providers';

const App = () => {
  return (
    <AppStateProvider>
      <AppNavigator />
    </AppStateProvider>
  );
};

export default App;
