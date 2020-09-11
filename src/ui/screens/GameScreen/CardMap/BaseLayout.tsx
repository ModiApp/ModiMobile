import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  LayoutRectangle,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import { useGameState } from '@modi/hooks';

export type BaseLayoutRenderItem = (
  /** zero is the card closes to current player, then goes clockwise */
  idx: number,
  /** in case the item needs to rotate to offset the cards rotation */
  radius: number,
) => JSX.Element | null;

interface BaseLayoutProps {
  numPlaces: number;
  renderItem: BaseLayoutRenderItem;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ numPlaces, renderItem }) => {
  const [layout, setLayout] = useState<LayoutRectangle>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  const gameState = useGameState();

  const rotation = (2 * Math.PI) / (gameState.players.length || 1);
  const itemWidth = (layout?.width || 300) * 0.15;
  const itemAspectRatio = 1 / 1.528;
  const radius = (layout?.width || 300) * 0.35;

  const me = gameState.me || { id: undefined };
  const idxOfMe = gameState.players.findIndex((player) => player.id === me.id);
  const boardRotation = `${-idxOfMe * rotation}rad`;

  if (!gameState.me) {
    return null;
  }

  return (
    <Animated.View
      key={boardRotation}
      onLayout={onLayout}
      style={[styles.container, { transform: [{ rotate: boardRotation }] }]}
    >
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
    </Animated.View>
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
