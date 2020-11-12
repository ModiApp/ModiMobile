import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { colors } from '@modi/ui/styles';
import { useOnContainerLayout } from '@modi/hooks';

import {
  useFlipCardsAnimation,
  useDealCardsAnimation,
  useTrashCardsAnimation,
  useHighlightCardsAnimation,
} from './animations';

import AnimatingCard from './AnimatingCard';

interface CardTableProps {
  controller: React.RefObject<CardTableController>;
}
const CardTable: React.FC<CardTableProps> = ({ controller }) => {
  const [cardTableLayout, setCardTableLayout] = useOnContainerLayout();
  const [animatedCards, setAnimatedCards] = React.useState<AnimatedCard[]>([]);

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
  const setCards = useFlipCardsAnimation(setAnimatedCards);

  React.useImperativeHandle(
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
  );
};

const styles = StyleSheet.create({
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
});

export default CardTable;
