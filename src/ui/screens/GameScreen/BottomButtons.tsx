import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from '@modimobile/ui/components';

interface BottomButtonProps {
  getController(handle: BottomButtonsController): void;
  callbacks: BottomButtonsCallbacks;
}
const BottomButtons: React.FC<BottomButtonProps> = ({
  getController,
  callbacks,
}) => {
  const [controls, setControls] = useState<ControlsType | undefined>();

  const showControls = useCallback((type: ControlsType) => {
    setControls(type);
  }, []);

  const hideControls = useCallback(() => setControls(undefined), []);

  useEffect(() => {
    getController({
      showControls,
      hideControls,
    });
  }, [showControls, hideControls]);

  return (
    <View>
      {controls === 'Start Highcard' && (
        <Button
          title="Start Highcard"
          color="blue"
          onPress={callbacks.onStartHighcardBtnPressed}
        />
      )}
      {controls === 'Deal Cards' && (
        <Button
          title="Deal Cards"
          color="blue"
          onPress={callbacks.onDealCardsBtnPressed}
        />
      )}
      {controls === 'Stick/Swap' && (
        <>
          <Button
            title="Stick"
            onPress={callbacks.onStickBtnPressed}
            color="blue"
          />
          <Button
            title="Swap"
            onPress={callbacks.onSwapBtnPressed}
            color="red"
          />
        </>
      )}
      {controls === 'Game Over' && (
        <View style={styles.row}>
          <Button color="red" onPress={callbacks.onHomeBtnPressed}>
            <Icon name="home" />
          </Button>
          <Button
            title="Play Again"
            onPress={callbacks.onPlayAgainBtnPressed}
            color="blue"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});

export default BottomButtons;
