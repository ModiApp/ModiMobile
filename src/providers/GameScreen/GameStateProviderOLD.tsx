import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import io from 'socket.io-client';
import env from '@modi/env.json';

const createInitialGameState = (): ModiGameState => ({
  round: 0,
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
  activePlayerIdx: undefined,
});

interface GameStateProviderProps {
  gameId: string;
  accessToken: string;
  username: string;
  onPlayAgainLobbyIdRecieved: (lobbyId: string) => void;
}
const GameStateProvider: React.FC<GameStateProviderProps> = ({
  children,
  gameId,
  username,
  accessToken,
  onPlayAgainLobbyIdRecieved,
}) => {
  const [gameState, setGameState] = useState(createInitialGameState());
  useEffect(() => {
    setGameState(createInitialGameState());
  }, [gameId, accessToken]);

  const socket = useMemo(
    () =>
      io(`${env.API_URL}/games/${gameId}`, {
        query: { username, playerId: accessToken },
        autoConnect: false,
      }),
    [gameId, username, accessToken],
  );

  const socketHash = socket.toString();

  useFocusEffect(
    useCallback(() => {
      socket.disconnected && socket.open();
      return () => {
        socket.connected && socket.disconnect();
      };
    }, [socketHash]),
  );

  useEffect(() => {
    socket.disconnected && socket.open();
  }, [socket.disconnected]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.on('GAME_STATE_UPDATED', setGameState);
      socket.on('PLAY_AGAIN_LOBBY_ID', onPlayAgainLobbyIdRecieved);
    });
  }, [socketHash]);

  const dispatch = useCallback(
    (...action: GameStateDispatchAction) => {
      const [event, ...args] = action;
      socket.emit(event, ...args);
    },
    [socketHash],
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
      players.length > 0 &&
      players.filter((player) => player.lives > 0).length === 1;
    const _activePlayerIdx = players.findIndex(
      (player) => alivePlayers[moves.length]?.id === player.id,
    );
    const activePlayerIdx =
      _activePlayerIdx === -1 ? undefined : _activePlayerIdx;

    return { me, isMyTurn, isEndOfGame, activePlayerIdx };
  }, [gameState, accessToken]);

  return (
    <GameStateContext.Provider
      value={{ ...gameState, ...tailoredState, dispatch }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export function useGameState() {
  return useContext(GameStateContext);
}

export default GameStateProvider;
