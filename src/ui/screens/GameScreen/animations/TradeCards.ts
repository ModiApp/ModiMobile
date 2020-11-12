import { useCallback } from 'react';
import { Animated } from 'react-native';

import { normalizeAngle } from './util';

function useTradePlacesAnimation(
  animationVals: { position: Animated.ValueXY; rotation: Animated.Value }[],
  boardHeight: number,
  cardHeight: number,
) {
  return useCallback(
    (
      fromIdx: number,
      toIdx: number,
      onSwap?: () => void,
      onComplete?: () => void,
    ) => {
      const rotationFactor = (2 * Math.PI) / animationVals.length;
      const boardRadius = (boardHeight - cardHeight - 20) / 2;
      const fromVal = {
        position: {
          x: Math.cos(rotationFactor * fromIdx + Math.PI / 2) * boardRadius,
          y: Math.sin(rotationFactor * fromIdx + Math.PI / 2) * boardRadius,
        },
        rotation: normalizeAngle(rotationFactor * fromIdx),
      };
      const toVal = {
        position: {
          x: Math.cos(rotationFactor * toIdx + Math.PI / 2) * boardRadius,
          y: Math.sin(rotationFactor * toIdx + Math.PI / 2) * boardRadius,
        },
        rotation: normalizeAngle(rotationFactor * toIdx),
      };
      const meetPoint = {
        position: {
          x:
            ((toVal.position.x - fromVal.position.x) * 2) / 3 +
            fromVal.position.x,
          y:
            ((toVal.position.y - fromVal.position.y) * 2) / 3 +
            fromVal.position.y,
        },
        rotation:
          ((toVal.rotation - fromVal.rotation) * 2) / 3 + fromVal.rotation,
      };

      Animated.parallel([
        Animated.timing(animationVals[fromIdx].position, {
          duration: 600,
          toValue: meetPoint.position,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[fromIdx].rotation, {
          duration: 600,
          toValue: meetPoint.rotation,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[toIdx].position, {
          delay: 400,
          duration: 200,
          toValue: meetPoint.position,
          useNativeDriver: true,
        }),
        Animated.timing(animationVals[toIdx].rotation, {
          delay: 400,
          duration: 200,
          toValue: meetPoint.rotation,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onSwap && onSwap();
        Animated.parallel([
          Animated.timing(animationVals[fromIdx].position, {
            duration: 300,
            toValue: fromVal.position,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[fromIdx].rotation, {
            duration: 300,
            toValue: fromVal.rotation,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[toIdx].position, {
            duration: 100,
            toValue: toVal.position,
            useNativeDriver: true,
          }),
          Animated.timing(animationVals[toIdx].rotation, {
            duration: 100,
            toValue: toVal.rotation,
            useNativeDriver: true,
          }),
        ]).start(onComplete);
      });
    },
    [animationVals, boardHeight, cardHeight],
  );
}

export default useTradePlacesAnimation;
