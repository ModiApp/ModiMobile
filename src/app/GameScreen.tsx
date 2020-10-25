import React, {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { ScreenContainer } from '@modi/ui/components';
import { generateRandomCardMap } from '@modi/ui/util';
import { colors } from '@modi/ui/styles';

import { useOnContainerLayout } from '@modi/hooks';
import useDealCardsAnimation from './animations/DealCards';
import useTrashCardsAnimation from './animations/TrashCards';

import cardImgs from '@modi/ui/assets/img/cards';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);
  const runDealTrashCycle = useCallback(() => {
    gameScreen.current?.dealCards(generateRandomCardMap(), () => {
      setTimeout(() => {
        gameScreen.current?.trashCards(() => {
          setTimeout(() => runDealTrashCycle(), 1000);
        });
      }, 1000);
    });
  }, []);

  useEffect(() => {
    runDealTrashCycle();
  }, []);

  return <GameScreen controller={gameScreen} />;
};

interface GameScreenController {
  dealCards(cardMap: CardMap, onComplete?: () => void): void;
  trashCards(onComplete?: () => void): void;
}

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

  useImperativeHandle(
    controller,
    () => ({
      dealCards,
      trashCards,
    }),

    [dealCards, trashCards],
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.cardTable} onLayout={setCardTableLayout}>
          {animatedCards.map(
            ({ position, rotation, value, dimensions }, idx) => (
              <Animated.View
                key={`${idx}${value}`}
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
                  }}
                >
                  <Card value={value} {...dimensions} />
                </Animated.View>
              </Animated.View>
            ),
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

interface CardProps {
  value: Card | boolean;
  width: number;
  height: number;
}
const Card: React.FC<CardProps> = ({ value, width, height }) => {
  if (!value) {
    return null;
  }

  const style = [styles.card, { width, height }];

  if (typeof value === 'boolean') {
    return <Image source={cardImgs.back} style={style} resizeMode="contain" />;
  }
  const { suit, rank } = value;
  return (
    <Image source={cardImgs[suit][rank]} style={style} resizeMode="contain" />
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
