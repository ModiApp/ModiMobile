import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  LayoutRectangle,
  Image,
} from 'react-native';

import { range } from '@modi/ui/util';
import { useGameState, useStateQueue } from '@modi/hooks';

import useDealCardsAnimation from './animations/dealCards';
import useTrashCardsAnimation from './animations/trashCards';
import { colors } from '@modi/ui/styles';
import cardImgs from '@modi/ui/assets/img/cards';

const AnimatingCardMap: React.FC = () => {
  const [layout, setLayout] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const gamestate = useGameState();
  const cardOrder = gamestate.players.map((player) => player.card);

  const cardHeight = range(2, 20, 0.32, 0.12, cardOrder.length) * layout.height;
  const cardWidth = cardHeight / 1.528;

  const [isAnimating, setIsAnimating] = useState(true);
  const [lastOrder, currOrder] = useStateQueue(cardOrder, !isAnimating);

  const animatedValues = useMemo(
    () =>
      currOrder.map(() => ({
        rotation: new Animated.Value(0),
        position: new Animated.ValueXY({ x: 0, y: layout.height }),
      })),
    [currOrder.length, layout.height],
  );

  const [isDealingCards, animateCardsBeingDealt] = useDealCardsAnimation(
    currOrder.length,
    animatedValues,
    layout.height,
    cardHeight,
  );

  const [isTrashingCards, animateCardsSentToTrash] = useTrashCardsAnimation(
    animatedValues,
    layout.height,
  );

  useEffect(() => {
    setIsAnimating(
      ![isDealingCards, isTrashingCards].every(
        (condition) => condition === false,
      ),
    );
  }, [isDealingCards, isTrashingCards]);

  useEffect(() => {
    if (lastOrder !== currOrder) {
      if (
        // Cards were just dealt
        lastOrder.every((card) => card === undefined) &&
        currOrder.filter((card) => card !== undefined).length > 0
      ) {
        animateCardsBeingDealt();
      }
      if (
        // Cards were just sent to trash
        lastOrder.filter((card) => card !== undefined).length > 0 &&
        currOrder.every((card) => card === undefined)
      ) {
        animateCardsSentToTrash();
      }
    }
    console.log('useeffect was called');
  }, [currOrder, layout]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  console.log(currOrder);

  const rotation = (2 * Math.PI) / (gamestate.players.length || 1);
  const me = gamestate.me || { id: undefined };
  const idxOfMe = gamestate.players.findIndex((player) => player.id === me.id);
  const boardRotation = `${-idxOfMe * rotation}rad`;

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View
        key={boardRotation}
        style={[
          styles.table,
          {
            transform: [{ rotate: boardRotation }],
          },
        ]}
      >
        {currOrder.map((card, idx) => (
          <Animated.View
            key={idx}
            style={[
              styles.cardContainer,
              {
                transform: [
                  { translateX: -cardWidth / 2 },
                  { translateY: -cardHeight / 2 },
                  { translateX: animatedValues[idx].position.x },
                  { translateY: animatedValues[idx].position.y },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                height: cardHeight,
                width: cardWidth,
                transform: [{ rotate: animatedValues[idx].rotation }],
              }}
            >
              {card ? (
                <Image
                  source={cardImgs[card?.suit!][card?.rank!]}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <Image
                  source={cardImgs.back}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </Animated.View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
    backgroundColor: colors.lightGreen,
  },
  table: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardContainer: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});

export default AnimatingCardMap;
