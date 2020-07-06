import React, { useState, useEffect, useCallback } from 'react';
import { View, Animated } from 'react-native';

import { Text } from '../components';
import { range } from '../util';

type CardPlacement = {
  position: { x: number; y: number };

  /** Example value: '1.57rad' */
  rotation: string;
};

const CardMiniMap: React.FC<{
  cards: number[];
  onRadius: (r: number) => void;
}> = ({ cards, onRadius }) => {
  const numCards = cards.length;
  const [mapWidth, setMapWidth] = useState(0);
  const cardHeight = range(3, 15, 130, 50, numCards);
  const cardAspectRatio = 25 / 35;

  // Animate when cards change:
  const [cardOrder, setCardOrder] = useState(cards);
  useEffect(() => {
    if (cards !== cardOrder) {
      setCardOrder(cards);
    }
  }, [cards]);

  const getCardPlacements = useCallback((): CardPlacement[] => {
    const rotationFacotor = (2 * Math.PI) / cards.length;
    const circleRadius = mapWidth / 2 - cardHeight / 2;
    const circleRotationOffset = Math.PI / 2;
    onRadius(circleRadius);
    console.log('sending radius:', circleRadius);
    return cards.map((_, i) => ({
      position: {
        x: Math.cos(i * rotationFacotor + circleRotationOffset) * circleRadius,
        y: Math.sin(i * rotationFacotor + circleRotationOffset) * circleRadius,
      },
      rotation: `${i * rotationFacotor}rad`,
    }));
  }, [cards]);

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 1,
        backgroundColor: 'blue',
        borderRadius: mapWidth / 2,
      }}
      onLayout={e => setMapWidth(e.nativeEvent.layout.width)}>
      <View
        style={{
          position: 'absolute',
          left: (mapWidth - cardHeight * cardAspectRatio) / 2,
          top: (mapWidth - cardHeight) / 2,
        }}>
        {getCardPlacements().map(({ position, rotation }, i) => (
          <View
            style={{
              width: cardHeight * cardAspectRatio,
              height: cardHeight,
              position: 'absolute',
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              fontSize={range(3, 15, 78, 28, numCards)}
              transform={[{ rotate: `-${rotation}` }]}>
              {i}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CardMiniMap;
