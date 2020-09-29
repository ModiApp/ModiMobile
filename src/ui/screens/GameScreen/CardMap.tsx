import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Image,
} from 'react-native';

import { useGameScreenAnimations, useGameScreenLayout } from '@modi/providers';

import { colors } from '@modi/ui/styles';
import cardImgs from '@modi/ui/assets/img/cards';

const AnimatingCardMap: React.FC = () => {
  const [layout, layoutDispatch] = useGameScreenLayout();
  const { cards, placeholders, hitCard } = useGameScreenAnimations();

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      layoutDispatch.setBoardLayout(e.nativeEvent.layout);
    },
    [layoutDispatch.setBoardLayout],
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View
        key={layout.boardRotation}
        style={[
          styles.table,
          {
            transform: [{ rotate: `${layout.boardRotation}rad` }],
          },
        ]}
      >
        {placeholders.map((placeholder, idx) => (
          <Animated.View
            style={[
              styles.placeholder,
              {
                width: layout.cardWidth,
                height: layout.cardHeight,
                translateX: placeholder.position.x,
                translateY: placeholder.position.y,
                borderColor: placeholder.borderColor,
                transform: [{ rotate: `${placeholder.rotation}rad` }],
              },
            ]}
          />
        ))}
        {cards
          .filter((card) => card !== null)
          .map((card, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    { translateX: -layout.cardWidth / 2 },
                    { translateY: -layout.cardHeight / 2 },
                    { translateX: card!.position.x },
                    { translateY: card!.position.y },
                  ],
                },
              ]}
            >
              <Animated.View
                style={{
                  height: layout.cardHeight,
                  width: layout.cardWidth,
                  transform: [{ rotate: `${card!.rotation}rad` }],
                }}
              >
                {card!.faceUp ? (
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
  placeholder: {
    backgroundColor: colors.feltGreen,
  },
});

export default AnimatingCardMap;
