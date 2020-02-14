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

  async findLobbyById(id) {
    const lobby = await axios
      .get(`${API_URL}/lobbies/${id}`)
      .then(res => res.data.lobby);

    return lobby;
  }

  async isLobbyIdValid(id) {
    return !!(await this.findLobbyById(id));
  }

  useLobbyConnection(lobbyId, username) {
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
  }
}

export default new LobbyService();
