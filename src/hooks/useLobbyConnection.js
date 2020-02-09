import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// const API_URL = 'https://modi-server.herokuapp.com';
const API_URL = 'http://localhost:5000';

const initialLobbyState = {
  connectedPlayers: [],
  currentPlayer: {},
  lobbyLeader: {},
};

const useLobbyConnection = (lobbyId, username) => {
  const [lobbyInfo, setLobbyInfo] = useState(initialLobbyState);
  const sendMessage = useRef();
  useEffect(() => {
    const socket = io(`${API_URL}/lobbies/${lobbyId}?username=${username}`);

    socket.on('connect', () => {
      if (!sendMessage.current) {
        sendMessage.current = socket.send;
      }
      socket.on('lobby info', ({ connectedPlayers, lobbyLeader }) =>
        setLobbyInfo({
          currentPlayer: connectedPlayers.find(p => p.id === socket.id),
          connectedPlayers,
          lobbyLeader,
        }),
      );
    });

    return () => socket.disconnect();
  }, [lobbyId, username]);

  return { ...lobbyInfo, sendMessage: sendMessage.current };
};

export default useLobbyConnection;
