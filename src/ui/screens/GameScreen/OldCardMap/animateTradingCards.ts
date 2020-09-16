import { Animated } from 'react-native';

function animateTradingCards(
  idx: number,
  radius: number,
  idxOfTrader: number | undefined,
  numPlayers: number,
) {
  const rotationFactor = (2 * Math.PI) / numPlayers;
  const rotate = new Animated.Value(0);
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);

  if (idxOfTrader !== undefined) {
    if (idx === idxOfTrader) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: rotationFactor,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -(Math.cos(rotationFactor) * radius),
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -Math.sin(rotationFactor) * radius * 0.42,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(250),
      ]).start();
    }
    if (idx === (idxOfTrader + 1) % numPlayers) {
      Animated.sequence([
        Animated.delay(250),
        Animated.parallel([
          Animated.timing(rotate, {
            toValue: -rotationFactor,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: Math.cos(rotationFactor) * radius,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -Math.sin(rotationFactor) * radius * 0.42,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }
  return { rotate, translateX, translateY };
}

export default animateTradingCards;
