import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  LayoutRectangle,
  LayoutChangeEvent,
} from 'react-native';

import { CardBack, Text } from '@modi/ui/components';
import { useGameState } from '@modi/hooks';
import { colors } from '@modi/ui/styles';

const CardMap: React.FC = () => {
  const [layout, setLayout] = useState<LayoutRectangle>();
  const gameState = useGameState();
  const numPlaceholders = 5;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  /** Static outlines for each players card, even when
   * cards aren't on the table */
  const CardPlaceholders = useCallback(() => {
    const rotation = (2 * Math.PI) / numPlaceholders;
    return !layout ? null : (
      <View>
        {Array(numPlaceholders)
          .fill(null)
          .map((_, idx) => {
            return (
              <View
                key={idx}
                style={[
                  styles.cardPlaceholder,
                  {
                    transform: [
                      { translateX: -37.5 },
                      { translateY: -50 },
                      { rotate: `${rotation * idx}rad` },
                      { translateY: 125 },
                    ],
                  },
                ]}
              >
                <Text
                  style={{
                    transform: [
                      { translateY: -20 },
                      { rotate: `${-rotation * idx}rad` },
                    ],
                  }}
                >
                  {idx}
                  {/* {idx}:{Math.cos(rotation * idx).toPrecision(3)} */}
                </Text>
              </View>
            );
          })}
      </View>
    );
  }, [numPlaceholders, layout]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <CardPlaceholders />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholder: {
    // borderWidth: 2,
    // borderColor: 'black',
    height: 100,
    aspectRatio: 0.75,
    backgroundColor: colors.lightGreen,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default CardMap;
