import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Animated, View, LayoutChangeEvent, Easing } from 'react-native';

import { GameStateContext, AppStateContext } from '../../providers';
import useCardAnimation from '../../hooks/useCardAnimation';
import { ScreenContainer, Container } from '../components';
import PlayingCard from '../components/PlayingCard';
import Text from '../components/Text';
import Button from '../components/Button';
import { HomeIcon } from '../icons';
import { NavigationContext, StackActions } from 'react-navigation';

const GameScreen: React.FC<{
  // gameState: ModiGameState;
}> = () => {
  const { me } = useContext(GameStateContext);

  // const [card, cardPosAnim] = useCardAnimation(gameState, gameAccessToken);
  const card = me?.card;
  return (
    <ScreenContainer>
      <Container>
        <Text size={24}>{me?.username}</Text>
        <Text size={16}>Lives: {me?.lives}</Text>
      </Container>
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        <Animated.View
          style={{
            // position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // transform: [
            //   {
            //     translateX: cardPosAnim.x.interpolate({
            //       inputRange: [-1, 1],
            //       outputRange: ['-100%', '100%'],
            //     }),
            //   },
            //   {
            //     translateY: cardPosAnim.y.interpolate({
            //       inputRange: [0, 1],
            //       outputRange: ['0%', '-150%'],
            //     }),
            //   },
            // ],
          }}
        >
          {!!card && <PlayingCard suit={card.suit} rank={card.rank} />}
        </Animated.View>
      </View>
      <BottomControls />
    </ScreenContainer>
  );
};

const BottomControls: React.FC<{}> = () => {
  const { dispatch, isMyTurn, isEndOfGame, me } = useContext(GameStateContext);
  const onSwapBtnPressed = useCallback(() => {
    dispatch('MADE_MOVE', 'swap');
  }, [dispatch]);
  const onStickBtnPressed = useCallback(() => {
    dispatch('MADE_MOVE', 'stick');
  }, [dispatch]);
  const onPlayAgainBtnPressed = useCallback(() => {
    dispatch('PLAY_AGAIN');
  }, [dispatch]);

  const navigation = useContext(NavigationContext);
  const [_, updateGlobalState] = useContext(AppStateContext);
  const onHomeBtnPressed = useCallback(() => {
    updateGlobalState({ currGameId: undefined, gameAccessToken: undefined });
    navigation.dispatch(StackActions.popToTop());
  }, [navigation]);

  const [height, setHeight] = useState(0);
  const [isShowingControls, setIsShowingControls] = useState(true);
  const translateY = useMemo(() => new Animated.Value(height), [height]);
  const shouldShow = isMyTurn || isEndOfGame;

  useEffect(() => {
    if (shouldShow && !isShowingControls) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setIsShowingControls(true));
    }
    if (!shouldShow && isShowingControls) {
      Animated.timing(translateY, {
        toValue: height + 100,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setIsShowingControls(false));
    }
  }, [shouldShow, isShowingControls, height, translateY, me]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height),
    [],
  );
  return (
    <View onLayout={onLayout}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {isEndOfGame ? (
          <View style={{ flexDirection: 'row' }}>
            <Button
              color="red"
              onPress={onHomeBtnPressed}
              style={{ paddingHorizontal: 12, paddingVertical: 8 }}
            >
              <HomeIcon size={28} />
            </Button>
            <Button
              title="Play Again"
              color="blue"
              onPress={onPlayAgainBtnPressed}
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <View>
            <Button title="Swap" color="red" onPress={onSwapBtnPressed} />
            <Button title="Stick" color="blue" onPress={onStickBtnPressed} />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default GameScreen;
