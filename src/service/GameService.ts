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
    const [gameState, setGameState] = useState({
      waitingForPlayers: true,
      connectedPlayers: [],
    });
    const sendMessage = useRef(null);
    useEffect(() => {
      const socket = io(`${API_URL}/games/${gameId}`, {
        query: { username, authorizedPlayerId },
      });
      socket.on('connect', () => {
        !sendMessage.current && (sendMessage.current = socket.send);
        socket.on('updated game state', setGameState);
        socket.on('game on', () => {});
      });
      return () => socket.disconnect();
    }, [authorizedPlayerId, gameId, username]);
    return { ...gameState, sendMessage: sendMessage.current };
  }
}

interface Card {
  suit: 'spades' | 'clubs' | 'hearts' | 'diamonds';
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  value: () => Number;
}
function createGameService(onRecievedCard: (card: Card) => void) {}

export default new GameService();
