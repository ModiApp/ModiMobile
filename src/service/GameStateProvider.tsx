import React from 'react';
import io from 'socket.io-client';
import config from 'react-native-config';

type GameStateContextType = ModiGameState & { dispatch: (action: any) => void };
const createInitialGameState = (): ModiGameState => ({
  round: 0,
  dealerId: '',
  activePlayerIdx: 0,
  playersCards: {},
  moves: [],
  liveCounts: [],
  cardOrder: [],
  playerOrder: [],
});
const GameStateContext = React.createContext<GameStateContextType>({
  ...createInitialGameState(),
  dispatch: () => {},
});

interface ModiGameStateProviderProps {
  gameId: string;
  authorizedPlayerId: string;
  username: string;
}
const ModiGameStateProvider: React.FC<ModiGameStateProviderProps> = ({
  children,
  gameId,
  username,
  authorizedPlayerId,
}) => {
  const [gameState, setGameState] = React.useState<ModiGameState>(
    createInitialGameState(),
  );
  const connection = React.useRef(
    io(`${config.API_URL}/games/${gameId}`, {
      query: { username, authorizedPlayerId },
      autoConnect: false,
    }),
  ).current;

  React.useEffect(() => {
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);

  connection.on('GAME_STATE_UPDATED', setGameState);

  // Will use this to have the client send messages to the server
  const dispatch = (action: any) => {};

  return (
    <GameStateContext.Provider value={{ ...gameState, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default ModiGameStateProvider;
