import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { StackActions } from 'react-navigation';
import { Animated, Easing, View, LayoutChangeEvent } from 'react-native';

import { useGameState, useAppState, useNavigation } from '@modi/hooks';
import { Button, Icon } from '@modi/ui/components';

const BottomControls: React.FC<{}> = () => {
  const { dispatch, isMyTurn, isEndOfGame, me } = useGameState();
  const [_, updateGlobalState] = useAppState();

  const onSwapBtnPressed = useCallback(() => {
    dispatch('MADE_MOVE', 'swap');
  }, [dispatch]);

  const onStickBtnPressed = useCallback(() => {
    dispatch('MADE_MOVE', 'stick');
  }, [dispatch]);

  const onPlayAgainBtnPressed = useCallback(() => {
    dispatch('PLAY_AGAIN');
  }, [dispatch]);

  const navigation = useNavigation();

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
              <Icon name="home" size={28} />
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

export default BottomControls;
