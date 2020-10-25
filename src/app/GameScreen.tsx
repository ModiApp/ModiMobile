import React, { useImperativeHandle, useRef, useEffect } from 'react';
import { ScreenContainer, Text } from '@modi/ui/components';

const App: React.FC = () => {
  const gameScreen = useRef<GameScreenController>(null);
  useEffect(() => {
    setTimeout(() => {
      gameScreen.current?.dealCards();
    }, 3000);
  }, []);
  return <GameScreen controller={gameScreen} />;
};

interface GameScreenController {
  dealCards(): void;
}

interface GameScreenProps {
  controller: React.RefObject<GameScreenController>;
}
const GameScreen: React.FC<GameScreenProps> = ({ controller }) => {
  useImperativeHandle(
    controller,
    (): GameScreenController => ({
      dealCards() {
        console.log('dealing the cards');
      },
    }),
  );
  return (
    <ScreenContainer>
      <Text>Hello there</Text>
    </ScreenContainer>
  );
};

export default App;
