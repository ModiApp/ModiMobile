import io from 'socket.io-client';

const API_URL = 'http://localhost:5000';

class ModiGameService {
  private connection: SocketIOClient.Socket;

  constructor(config: GameServiceConfig) {
    this.connection = io(`${API_URL}/games/${config.gameId}`, {
      query: {
        username: config.username,
        authorizedPlayerId: config.authorizedPlayerId,
      },
    });

    this.connection.on(
      'game state changed',
      (action: GameStateChangeAction) => {
        config.onGameStateChanged(action);
      },
    );
  }

  disconnect() {
    this.connection.disconnect();
  }
}
function createGameService(config: GameServiceConfig) {
  return new ModiGameService(config);
}

function createMockGameService(config: GameServiceConfig) {
  const { gameId, authorizedPlayerId, username } = config;
  console.log('connecting to mock game:', gameId, authorizedPlayerId, username);
  const mockPlayerIds = ['123', '456', authorizedPlayerId, '789'];
  const gameState: ModiGameState = {
    round: 1,
    dealerId: mockPlayerIds[mockPlayerIds.length - 1],
    activePlayerIdx: 0,
    playersCards: new Map([
      ['123', true],
      ['456', true],
      [authorizedPlayerId, true],
      ['789', true],
    ]),
    moves: [],
    liveCounts: mockPlayerIds.map(id => [id, 3]),
    cardOrder: [0, 1, 2, 3],
    playerOrder: mockPlayerIds,
  };
  config.onGameStateChanged({
    type: 'set entire state',
    payload: gameState,
  });

  return {
    disconnect: () => console.log('disconnecting from mock game service'),
  };
}

export { createGameService, createMockGameService };
// export default new GameService();
