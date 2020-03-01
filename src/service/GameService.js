import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// const API_URL = 'https://d0773c55.ngrok.io';
const API_URL = 'http://localhost:5000';

class GameService {
  async isGameIdValid(id) {
    return axios
      .get(`${API_URL}/games/${id}/check-existence`)
      .then(res => res.data.exists);
  }

  useGameConnection(gameId, authorizedPlayerId, username) {
    const [gameInfo, setGameInfo] = useState({
      connectedPlayers: [],
    });
    const sendMessage = useRef(null);
    useEffect(() => {
      const socket = io(`${API_URL}/games/${gameId}`, {
        query: { username, authorizedPlayerId },
      });
      socket.on('connect', () => {
        !sendMessage.current && (sendMessage.current = socket.send);
        socket.on('game info', setGameInfo);
      });
      return () => socket.disconnect();
    }, [authorizedPlayerId, gameId, username]);
    return { ...gameInfo, sendMessage: sendMessage.current };
  }
}

export default new GameService();
