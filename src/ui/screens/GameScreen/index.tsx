import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@modimobile/ui/components';

import CardTable from './CardTable';
import PlayerCirlce from './PlayerCirlce';
import BottomButtons from './BottomButtons';

interface GameScreenProps {
  cardMapRef: React.RefObject<CardTableController>;
  buttonsRef: React.RefObject<BottomButtonController>;
  buttonCallbacks: BottomButtonCallbacks;
  connections: ConnectionResponseDto;
}
const GameScreen: React.FC<GameScreenProps> = ({
  cardMapRef,
  buttonsRef,
  connections,
  buttonCallbacks,
}) => {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <PlayerCirlce players={connections}>
          <CardTable controller={cardMapRef} />
        </PlayerCirlce>
      </View>
      <View style={styles.bottomButtonContainer}>
        <BottomButtons controller={buttonsRef} callbacks={buttonCallbacks} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOfNames: {
    maxHeight: '100%',
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  tableContainer: {
    width: '90%',
    position: 'absolute',
  },
  bottomButtonContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
});

export default GameScreen;
