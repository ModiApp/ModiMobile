import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@modi/ui/components';

import CardTable from './CardTable';
import PlayerCirlce from './PlayerCirlce';

interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
  connections: { username: string; connected: boolean }[];
}
const GameScreen: React.FC<GameScreenProps> = ({ controller, connections }) => {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <PlayerCirlce players={connections}>
          <CardTable controller={controller} />
        </PlayerCirlce>
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
});

export default GameScreen;
