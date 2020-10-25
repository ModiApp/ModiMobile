import React, {
  useImperativeHandle,
  useRef,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { ScreenContainer, Text } from '@modi/ui/components';
import { range } from '@modi/ui/util';
import { colors } from '@modi/ui/styles';

import { useOnContainerLayout } from '@modi/hooks';
import useDealCardsAnimation from './animations/DealCards';
import cardImgs from '@modi/ui/assets/img/cards';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);

  useEffect(() => {
    gameScreen.current?.dealCards([
      true,
      true,
      { suit: 'spades', rank: 13 },
      true,
    ]);
  }, []);

  return <GameScreen controller={gameScreen} numPlayers={4} />;
};

type CardMap = (Card | boolean)[];
interface GameScreenController {
  dealCards(cardMap: CardMap, onComplete?: () => void): void;
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

  const cardHeight = useMemo(
    () => range(2, 20, 0.32, 0.12, numPlayers) * cardTableLayout.height,
    [cardTableLayout, numPlayers],
  );
  const cardWidth = cardHeight / 1.528;

  const [cards, setCards] = useState<CardMap>(Array(numPlayers).fill(false));
  const dealCards = useDealCardsAnimation(
    setCards,
    cardAnimationVals,
    cardTableLayout.height,
    cardHeight,
  );

  useImperativeHandle(controller, () => ({
    dealCards,
  }));

  // const animationVals;
  return (
    <ScreenContainer>
      <View style={styles.cardTable} onLayout={setCardTableLayout}>
        {cardAnimationVals.map(({ position, rotation }, idx) => (
          <Animated.View
            style={{
              position: 'absolute',
              width: cardWidth,
              height: cardHeight,
              transform: [
                { translateY: position.y },
                { translateX: position.x },
              ],
            }}
          >
            <Animated.View
              style={[
                { transform: [{ rotate: `${rotation}rad` }] },
                styles.card,
              ]}
            >
              <Card value={cards[idx]} />
            </Animated.View>
          </Animated.View>
        ))}
      </View>
    </ScreenContainer>
  );
};

const Card: React.FC<{ value: Card | boolean }> = ({ value }) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'boolean') {
    return (
      <Image source={cardImgs.back} style={styles.card} resizeMode="contain" />
    );
  }
  const { suit, rank } = value;
  return (
    <Image
      source={cardImgs[suit][rank]}
      style={styles.card}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  cardTable: {
    backgroundColor: colors.lightGreen,
    borderRadius: 1000,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    flex: 1,
    width: 100,
    height: 150,
  },
});

export default App;
