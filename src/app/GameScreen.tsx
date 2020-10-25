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

  const randomCards: CardMap = Array(Math.floor(Math.random() * 12) + 6)
    .fill(null)
    .map(() => {
      switch (Math.floor(Math.random() * 3)) {
        case 0:
          return true;
        case 1:
          return true;
        case 2:
          return {
            rank: Math.floor(Math.random() * 13) + 1,
            suit: ['spades', 'hearts', 'clubs', 'diamonds'][
              Math.floor(Math.random() * 4)
            ],
          } as Card;
        default:
          return true;
      }
    });

  useEffect(() => {
    gameScreen.current?.dealCards(randomCards);
  }, [randomCards]);

  return <GameScreen controller={gameScreen} numPlayers={randomCards.length} />;
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
            key={`${idx}${cards[idx]}`}
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
              style={{
                position: 'absolute',
                width: cardWidth,
                height: cardHeight,
                transform: [{ rotate: rotation }],
              }}
            >
              <Card value={cards[idx]} width={cardWidth} height={cardHeight} />
            </Animated.View>
          </Animated.View>
        ))}
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
  cardTable: {
    backgroundColor: colors.lightGreen,
    borderRadius: 1000,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // borderRadius: 12,
    flex: 1,
  },
});

export default App;
