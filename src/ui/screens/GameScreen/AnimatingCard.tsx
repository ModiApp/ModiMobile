import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

import cardImgs from '@modimobile/ui/assets/img/cards';

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
  const source =
    typeof value === 'boolean'
      ? cardImgs.back
      : cardImgs[value.suit][value.rank];

  return <Image source={source} style={style} resizeMode="contain" />;
};

const AnimatingCard: React.FC<CardProps> = ({ value, width, height }) => {
  const [currValue, setCurrValue] = useState(value);
  const scaleX = useRef(new Animated.Value(1)).current;

  const flipTo = useCallback(
    (toValue: Card | boolean) => {
      Animated.timing(scaleX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrValue(toValue);
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [scaleX, setCurrValue],
  );

  useEffect(() => {
    flipTo(value);
  }, [value, flipTo]);

  return (
    <Animated.View
      style={{
        width,
        height,
        transform: [{ scaleX }],
      }}
    >
      <Card width={width} height={height} value={currValue} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
});

export { Card };
export default AnimatingCard;
