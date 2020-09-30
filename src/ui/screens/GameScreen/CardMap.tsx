import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  Image,
} from 'react-native';

import { useGameScreenAnimations, useGameScreenLayout } from '@modi/providers';

import { Text } from '@modi/ui/components';
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
            key={idx}
            style={[
              styles.cardContainer,
              {
                transform: [
                  {
                    translateX: placeholder.position.x - placeholder.width / 2,
                  },
                  {
                    translateY: placeholder.position.y - placeholder.height / 2,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.placeholder,
                {
                  width: placeholder.width,
                  height: placeholder.height,
                  borderColor: placeholder.borderColor,
                  borderWidth: placeholder.borderColor === 'none' ? 0 : 4,
                  transform: [{ rotate: `${placeholder.rotation}rad` }],
                },
              ]}
            >
              <Text>{idx} What's up cunts!</Text>
            </Animated.View>
          </Animated.View>
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
                key={`inner-${idx}`}
                style={{
                  height: layout.cardHeight,
                  width: layout.cardWidth,
                  transform: [{ rotate: card!.rotation }],
                }}
              >
                {card!.faceUp ? (
                  <Image
                    source={cardImgs[card!.suit][card!.rank]}
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
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
