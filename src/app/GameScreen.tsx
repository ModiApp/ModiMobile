import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer, Text } from '@modi/ui/components';

import { generateRandomCardMap } from './animations/util';
import CardTable from './CardTable';
import PlayerCirlce from './PlayerCirlce';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const timeoutId = setTimeout(() => {
      const numCards = 10;
      gameScreen.current?.dealCards(generateRandomCardMap(numCards), () => {
        intervalId = setInterval(() => {
          gameScreen.current?.setCards(generateRandomCardMap(numCards));
        }, 3000);
      });
    }, 1000);
    return () => {
      intervalId && clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return <GameScreen controller={gameScreen} />;
};
interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
}

const fakeNames = [
  'ikey',
  'sham',
  'ralph',
  'alan',
  'jbert',
  'ray',
  'frast',
  'mike',
  'mret',
  'kube',
];
const GameScreen: React.FC<GameScreenProps> = ({ controller }) => {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <PlayerCirlce
          players={fakeNames.map((username) => ({ username, connected: true }))}
        >
          <CardTable controller={controller} />
        </PlayerCirlce>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOfNames: {
    maxHeight: '100%',
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  tableContainer: {
    width: '90%',
    position: 'absolute',
  },
});

export default App;
