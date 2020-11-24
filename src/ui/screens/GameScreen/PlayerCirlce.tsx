import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@modimobile/ui/components';
import { useOnContainerLayout } from '@modimobile/hooks';

interface PlayerCirlceProps {
  players: ConnectionResponseDto;
}
const PlayerCircle: React.FC<PlayerCirlceProps> = ({ players, children }) => {
  const [layout, onLayout] = useOnContainerLayout();
  console.log(players);
  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.childrenContainer}>{children}</View>
      {players.map((player, idx) => {
        const rotate = ((Math.PI * 2) / players.length) * idx + Math.PI / 2;
        const radius = layout.width * 0.95;
        return (
          <Text
            key={`${idx}`}
            style={{
              position: 'absolute',
              color: player.connected ? 'white' : 'lightgrey',
              transform: [
                {
                  translateX: (Math.cos(rotate) * radius) / 2,
                },
                {
                  translateY: (Math.sin(rotate) * radius) / 2,
                },
                { rotate: `${(rotate % Math.PI) - Math.PI / 2}rad` },
              ],
            }}
          >
            {player.username}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1000,
    maxHeight: '100%',
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'brown',
  },
  childrenContainer: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
  },
});

export default PlayerCircle;
