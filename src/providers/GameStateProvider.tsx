import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import env from '@modi/env.json';

const createInitialGameState = (): ModiGameState => ({
  round: -1,
  moves: [],
  players: [],
  _stateVersion: 0,
});
const GameStateContext = createContext<GameStateContextType>({
  ...createInitialGameState(),
  dispatch: () => {},
  me: undefined,
  isMyTurn: false,
  isEndOfGame: false,
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
  const socket = useMemo(
    () =>
      io(`${env.API_URL}/games/${gameId}`, {
        query: { username, playerId: accessToken },
        autoConnect: false,
      }),
    [gameId, username, accessToken],
  );

  useEffect(() => {
    socket.disconnected && socket.open();
    return () => {
      socket.connected && socket.disconnect();
    };
  }, [socket]);

  socket.on('GAME_STATE_UPDATED', setGameState);
  socket.on('PLAY_AGAIN_LOBBY_ID', onPlayAgainLobbyIdRecieved);

  const dispatch = useCallback(
    (...action: GameStateDispatchAction) => {
      const [event, ...args] = action;
      socket.emit(event, ...args);
    },
    [socket],
  );

  const tailoredState = useMemo(() => {
    const { players, moves } = gameState;
    const alivePlayers = players.filter((player) => player.lives > 0);
    const idxOfMe = players.findIndex((player) => player.id === accessToken);
    const activeMeIdx = alivePlayers.findIndex(
      (player) => player.id === accessToken,
    );
    const me = idxOfMe !== -1 ? players[idxOfMe] : undefined;
    const isMyTurn = activeMeIdx !== -1 && moves.length === activeMeIdx;
    const isEndOfGame =
      players.filter((player) => player.lives > 0).length === 1;

    return { me, isMyTurn, isEndOfGame };
  }, [gameState, accessToken]);

  return (
    <GameStateContext.Provider
      value={{ ...gameState, ...tailoredState, dispatch }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateContext;
