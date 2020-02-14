import axios from 'axios';

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
}

export default new LobbyService();
