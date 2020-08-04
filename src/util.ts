import axios from 'axios';
import Config from 'react-native-config';

export async function validateLobbyId(lobbyId: string): Promise<boolean> {
  try {
    await axios.head(`${Config.API_URL}/lobbies/${lobbyId}`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function validateGameId(gameId: string): Promise<boolean> {
  try {
    await axios.head(`${Config.API_URL}/games/${gameId}`);
    return true;
  } catch (e) {
    return false;
  }
}
