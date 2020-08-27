import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  LayoutRectangle,
  LayoutChangeEvent,
  PixelRatio,
} from 'react-native';

export type BaseLayoutRenderItem = (
  /** zero is the card closes to current player, then goes clockwise */
  idx: number,
  /** in case the item needs to rotate to offset the cards rotation */
  radius: number,
) => JSX.Element;

interface BaseLayoutProps {
  numPlaces: number;
  renderItem: BaseLayoutRenderItem;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ numPlaces, renderItem }) => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const rotation = (2 * Math.PI) / numPlaces;
  const itemWidth = (layout?.width || 0) * 0.15;
  const itemAspectRatio = 1 / 1.528;
  const radius = 140;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {Array(numPlaces)
        .fill(null)
        .map((_, idx) => {
          return (
            <View
              key={idx}
              style={{
                position: 'absolute',
                width: itemWidth,
                aspectRatio: itemAspectRatio,
                transform: [
                  { rotate: `${rotation * idx}rad` },
                  { translateY: radius },
                ],
              }}
            >
              {renderItem(idx, radius)}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseLayout;
