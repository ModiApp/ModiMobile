import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  createContext,
  useCallback,
} from 'react';
import io from 'socket.io-client';
import config from 'react-native-config';
import AppContext from './AppStateProvider';

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
  const [{ username }] = useContext(AppContext);
  const [lobbyState, setLobbyState] = useState(createInitialLobbyState());

  const socket = useMemo(
    () =>
      io(`${config.API_URL}/lobbies/${lobbyId}`, {
        query: { username },
        autoConnect: false,
      }),
    [lobbyId, username],
  );

  useEffect(() => {
    if (username && socket.disconnected) {
      socket.open();
    }
    return () => {
      socket.connected && socket.disconnect();
    };
  }, [username, socket]);

  socket.on('connect', () => {
    socket.on('LOBBY_STATE_UPDATED', setLobbyState);
    socket.on('EVENT_STARTED', onEventStarted);
  });

  const dispatch = useCallback(
    (action: LobbySocketAction) => socket.emit(action),
    [socket],
  );

  const currUserId = socket.id;

  return (
    <LobbyStateContext.Provider value={{ ...lobbyState, currUserId, dispatch }}>
      {children}
    </LobbyStateContext.Provider>
  );
};

export default LobbyStateContext;
