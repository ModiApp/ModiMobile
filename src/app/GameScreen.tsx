import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@modi/ui/components';

import { generateRandomCardMap } from './animations/util';
import CardTable from './CardTable';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);
  useEffect(() => {
    setTimeout(() => {
      const numCards = 10;
      gameScreen.current?.dealCards(generateRandomCardMap(numCards), () => {
        setInterval(() => {
          gameScreen.current?.setCards(generateRandomCardMap(numCards));
        }, 3000);
      });
    }, 1000);
  }, []);

  return <GameScreen controller={gameScreen} />;
};
interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
}
const GameScreen: React.FC<GameScreenProps> = ({ controller }) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <CardTable controller={controller} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
