import React from 'react';

import AppNavigator from './AppNavigator';
import { AppStateProvider } from './StateManager';

const App = () => (
  <AppStateProvider>
    <AppNavigator />
  </AppStateProvider>
);

export default App;
