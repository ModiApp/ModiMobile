import React, {
  useMemo,
  useState,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import io from 'socket.io-client';

import { useAppState } from '@modimobile/hooks';
import { API_URL } from '@modimobile/env.json';
import { acc } from 'react-native-reanimated';

interface LobbyState {
  attendees: LobbyAttendee[];
}
type LobbyStateContextType = LobbyState & {
  currUserId: string;
  dispatch: (action: LobbySocketAction) => void;
};

type LobbySocketAction = 'START_GAME';

const createInitialLobbyState = (): LobbyState => ({
  attendees: [],
});

const LobbyStateContext = createContext<LobbyStateContextType>({
  ...createInitialLobbyState(),
  currUserId: '',
  dispatch: () => {},
});

interface LobbyStateProviderProps {
  lobbyId: string;
  onEventStarted: (evtData: { eventId: string; accessToken: string }) => void;
}
export const LobbyStateProvider: React.FC<LobbyStateProviderProps> = ({
  lobbyId,
  children,
  onEventStarted,
}) => {
  const [{ username }] = useAppState();
  const [lobbyState, setLobbyState] = useState(createInitialLobbyState());

  const lastLobbyId = useRef(lobbyId);
  useEffect(() => {
    if (lobbyId !== lastLobbyId.current) {
      lastLobbyId.current = lobbyId;
      setLobbyState(createInitialLobbyState());
    }
  }, [lobbyId, lobbyState]);

  const socket = useMemo(
    () =>
      io(`${API_URL}/lobbies/${lobbyId}`, {
        query: { username },
        autoConnect: false,
      }),
    [lobbyId, username],
  );

  useFocusEffect(
    useCallback(() => {
      if (username && socket.disconnected) {
        socket.connect();
      }
      if (!username && socket.connected) {
        socket.disconnect();
      }
      return () => {
        socket.connected && socket.disconnect();
      };
    }, [username, socket]),
  );

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        socket.on('LOBBY_STATE_UPDATED', setLobbyState);
        socket.on('EVENT_STARTED', onEventStarted);
      });
    }
  }, [socket, onEventStarted, setLobbyState]);

  const dispatch = useCallback(
    (action: LobbySocketAction) => socket.emit(action),
    [socket, lobbyId],
  );

  const currUserId = socket.id;

  return (
    <LobbyStateContext.Provider value={{ ...lobbyState, currUserId, dispatch }}>
      {children}
    </LobbyStateContext.Provider>
  );
};

export default LobbyStateContext;
