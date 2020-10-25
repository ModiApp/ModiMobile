import React, { useImperativeHandle, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenContainer, Text } from '@modi/ui/components';
import { colors } from '@modi/ui/styles';

import { useOnContainerLayout } from '@modi/hooks';
import useDealCardsAnimation from './animations/DealCards';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);

  return <GameScreen controller={gameScreen} numPlayers={4} />;
};

interface GameScreenController {
  dealCards(): void;
}

interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
  numPlayers: number;
}
const GameScreen: React.FC<GameScreenProps> = ({ controller, numPlayers }) => {
  const [cardTableLayout, setCardTableLayout] = useOnContainerLayout();
  const cardAnimationVals = useMemo(
    () =>
      Array(numPlayers)
        .fill(null)
        .map(() => ({
          position: new Animated.ValueXY({ x: 0, y: 0 }),
          rotation: new Animated.Value(0),
        })),
    [cardTableLayout, numPlayers],
  );

  // const dealCards = useDealCardsAnimation(
  //   cardAnimationVals,
  //   cardTableLayout.height,
  // );

  useImperativeHandle(controller, () => ({
    dealCards: () => {},
  }));

  // const animationVals;
  return (
    <ScreenContainer>
      <View style={styles.cardTable} onLayout={setCardTableLayout} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  cardTable: {
    backgroundColor: colors.lightGreen,
    borderRadius: 1000,
    aspectRatio: 1,
  },
});

export default App;
