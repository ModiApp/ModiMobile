import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer, Text } from '@modi/ui/components';

import { GameScreen } from '@modi/ui';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);

  return <GameScreen controller={gameScreen} connections={[]} />;
};

export default App;
