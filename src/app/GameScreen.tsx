import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer, Text } from '@modi/ui/components';

import { generateRandomCardMap } from './animations/util';
import CardTable from './CardTable';
import { useOnContainerLayout } from '@modi/hooks';

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
  const [boardLayout, onBoardLayout] = useOnContainerLayout();
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.circleOfNames} onLayout={onBoardLayout}>
          <View style={styles.tableContainer}>
            <CardTable controller={controller} />
          </View>
          {fakeNames.map((name, idx) => {
            const rotate =
              ((Math.PI * 2) / fakeNames.length) * idx + Math.PI / 2;
            return (
              <Text
                key={`${idx}`}
                style={{
                  position: 'absolute',
                  transform: [
                    {
                      translateX: (Math.cos(rotate) * boardLayout.width) / 2,
                    },
                    {
                      translateY: (Math.sin(rotate) * boardLayout.width) / 2,
                    },
                    { rotate: `${(rotate % Math.PI) - Math.PI / 2}rad` },
                  ],
                }}
              >
                {name}
              </Text>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  circleOfNames: {
    width: '90%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableContainer: {
    width: '90%',
    position: 'absolute',
  },
});

export default App;
