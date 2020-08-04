import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useCallback,
} from 'react';
import io from 'socket.io-client';
import config from 'react-native-config';

type GameStateContextType = ModiGameState & {
  dispatch: (...action: GameStateDispatchAction) => void;
};
type GameStateDispatchAction =
  | ['MADE_MOVE', PlayerMove]
  | ['CHOOSE_DEALER', PlayerId]
  | ['PLAY_AGAIN'];

const createInitialGameState = (): ModiGameState => ({
  round: -1,
  moves: [],
  players: [],
  _stateVersion: 0,
});
const GameStateContext = createContext<GameStateContextType>({
  ...createInitialGameState(),
  dispatch: () => {},
});

interface GameStateProviderProps {
  gameId: string;
  accessToken: string;
  username: string;
  onPlayAgainLobbyIdRecieved: (lobbyId: string) => void;
}
export const GameStateProvider: React.FC<GameStateProviderProps> = ({
  children,
  gameId,
  username,
  accessToken,
  onPlayAgainLobbyIdRecieved,
}) => {
  const [gameState, setGameState] = useState(createInitialGameState());
  const socket = useRef(
    io(`${config.API_URL}/games/${gameId}`, {
      query: { username, playerId: accessToken },
      autoConnect: false,
    }),
  ).current;

  useEffect(() => {
    socket.disconnected && socket.open();
    return () => {
      socket.connected && socket.disconnect();
    };
  }, [socket]);

  socket.on('GAME_STATE_UPDATED', setGameState);
  socket.on('PLAY_AGAIN_LOBBY_ID', onPlayAgainLobbyIdRecieved);

  useEffect(() => {
    console.log(
      'updated game state:',
      JSON.stringify(gameState, undefined, '  '),
    );
  }, [gameState]);

  const dispatch = useCallback((...action: GameStateDispatchAction) => {
    const [event, ...args] = action;
    socket.emit(event, ...args);
  }, []);

  return (
    <GameStateContext.Provider value={{ ...gameState, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
