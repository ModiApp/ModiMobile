import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// const API_URL = 'https://modi-server.herokuapp.com';
const API_URL = 'http://localhost:5000';

class LobbyService {
  async createLobby() {
    const lobbyId = await axios
      .get(`${API_URL}/lobbies/new`)
      .then(res => res.data.lobbyId);

    return lobbyId;
  }

  async isLobbyIdValid(id) {
    return axios
      .get(`${API_URL}/lobbies/${id}/check-existence`)
      .then(res => res.data.exists);
  }

  useLobbyConnection(lobbyId, username, onEventStarted) {
    const [lobbyInfo, setLobbyInfo] = useState({
      connectedPlayers: [],
      currentPlayer: {},
      lobbyLeader: {},
    });
    const sendMessage = useRef();
    useEffect(() => {
      const socket = io(`${API_URL}/lobbies/${lobbyId}?username=${username}`);

      socket.on('connect', () => {
        if (!sendMessage.current) {
          sendMessage.current = msg => {
            console.log('sending start signal!');
            socket.emit(msg);
          };
        }
        socket.on('lobby info', ({ connections, lobbyLeader }) =>
          setLobbyInfo({
            currentPlayer: connections.find(p => p.id === socket.id),
            connectedPlayers: connections,
            lobbyLeader,
          }),
        );
        socket.on('event started', onEventStarted);
      });

      return () => socket.disconnect();
    }, [lobbyId, onEventStarted, username]);

    return { ...lobbyInfo, sendMessageToLobbyNsp: sendMessage.current };
  }
}

export default new LobbyService();
