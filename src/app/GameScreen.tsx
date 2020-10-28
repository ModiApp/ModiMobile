import React, {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { ScreenContainer } from '@modi/ui/components';

import { colors } from '@modi/ui/styles';

import { useOnContainerLayout } from '@modi/hooks';
import useDealCardsAnimation from './animations/DealCards';
import useTrashCardsAnimation from './animations/TrashCards';
import useHighlightCardsAnimation from './animations/HighlightCards';
import animateFromStateChange from './animations';
import { generateRandomCardMap } from './animations/util';
import GameHistory from '@modi/app/animations/mockStateHistory.json';

import AnimatingCard from './AnimatingCard';
const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);
  useEffect(() => {
    setTimeout(() => {
      const numCards = 10;
      gameScreen.current?.dealCards(generateRandomCardMap(numCards), () => {
        setInterval(() => {
          gameScreen.current?.setCards(generateRandomCardMap(numCards));
        }, 4000);
      });
    }, 1000);
  }, []);

  return <GameScreen controller={gameScreen} />;
};
interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
}
const GameScreen: React.FC<GameScreenProps> = ({ controller }) => {
  const [cardTableLayout, setCardTableLayout] = useOnContainerLayout();
  const [animatedCards, setAnimatedCards] = useState<AnimatedCard[]>([]);

  const dealCards = useDealCardsAnimation(
    setAnimatedCards,
    cardTableLayout.height,
  );

  const trashCards = useTrashCardsAnimation(
    animatedCards,
    setAnimatedCards,
    cardTableLayout.height,
  );

  const highlightCards = useHighlightCardsAnimation(setAnimatedCards);
  const setCards = useCallback(
    (newCardMap: CardMap) => {
      setAnimatedCards((cards) =>
        cards.map((card, idx) => ({
          ...card,
          value: newCardMap[idx],
        })),
      );
    },
    [setAnimatedCards],
  );

  useImperativeHandle(
    controller,
    () => ({
      dealCards,
      trashCards,
      highlightCards,
      setCards,
    }),
    [dealCards, trashCards, highlightCards, setCards],
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.cardTable} onLayout={setCardTableLayout}>
          {animatedCards.map(
            ({ position, rotation, value, dimensions, borderColor }, idx) => (
              <Animated.View
                key={`${idx}`}
                style={{
                  position: 'absolute',
                  ...dimensions,
                  transform: [
                    { translateY: position.y },
                    { translateX: position.x },
                  ],
                }}
              >
                <Animated.View
                  style={{
                    position: 'absolute',
                    ...dimensions,
                    transform: [{ rotate: rotation }],
                    shadowRadius: 10,
                    shadowColor: borderColor,
                    shadowOpacity: 0.9,
                  }}
                >
                  <AnimatingCard value={value} {...dimensions} />
                </Animated.View>
              </Animated.View>
            ),
          )}
        </View>
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
  cardTable: {
    backgroundColor: colors.lightGreen,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '100%',
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  card: {
    // borderRadius: 12,
    flex: 1,
  },
});

export default App;
