import React from 'react';

import AppNavigator from './AppNavigator';
import { AppStateProvider } from './StateManager';

// import { GameScreen } from './ui';
// import { GameScreenCreator } from './factory';

const App = () => (
  <AppStateProvider>
    <AppNavigator />
  </AppStateProvider>
);

export default App;
