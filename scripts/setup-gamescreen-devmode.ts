import cp from 'child_process';
import io from 'socket.io-client';
import axios from 'axios';
import _ from 'lodash';

import { API_URL, LOCAL_SERVER_PATH } from '../env/develop.json';

async function setupGameScreenDevMode() {
  // Install app to sims
  const simulators = {
    'iPhone 8': '98645249-8D55-4BAA-AEE1-E1728D953699',
    'iPhone 11 Pro Max': 'D87474A0-91ED-4143-9A0D-C979E3F35239',
    'iPhone 8 Plus': '3CCF7A5E-CB42-4B8C-A4DA-479A9ABD2169',
  };

  Object.keys(simulators).forEach((simName) => {
    const command = `yarn run ios-dev --simulator="${simName}"`;
    console.log('>', command);
    cp.execSync(command);
  });

  // Ensure local api is running
  let serverIsRunning = false;
  try {
    await axios.head(API_URL);
    serverIsRunning = true;
  } catch {
    const command = `cd ${LOCAL_SERVER_PATH} && yarn start`;
    console.log('>', command);
    cp.exec(command);
  }

  while (!serverIsRunning) {
    await new Promise((r) => setTimeout(r, 1000));
    await axios
      .head(`${API_URL}`)
      .then(() => {
        console.log('local backend running on', API_URL);
        serverIsRunning = true;
      })
      .catch(() => {});
  }

  // Create test lobby
  const lobbyId = await axios
    .get(`${API_URL}/lobbies/new`)
    .then((res) => res.data.lobbyId);

  const testUsernames = ['Nick', 'John', 'Kate'];

  const openTestGameOnSim = (
    simId: string,
    gameId: string,
    accessToken: string,
  ) => {
    const command = `xcrun simctl openurl ${simId} "modi://test-game/${gameId}?accessToken=${accessToken}"`;
    console.log('>', command);
    cp.exec(command);
  };

  const connectedSockets: SocketIOClient.Socket[] = [];
  type GameInfo = { eventId: string; accessToken: string };

  _.zip(testUsernames, Object.values(simulators)).forEach(
    async ([username, simId]) => {
      const conn = io(`${API_URL}/lobbies/${lobbyId}`, { query: { username } });
      conn.on('connect', () => connectedSockets.push(conn));
      conn.on('EVENT_STARTED', ({ eventId, accessToken }: GameInfo) =>
        openTestGameOnSim(simId!, eventId, accessToken),
      );
    },
  );

  while (connectedSockets.length !== testUsernames.length) {
    await new Promise((r) => setTimeout(r, 1000));
  }

  connectedSockets[0].emit('START_GAME');
}

setupGameScreenDevMode();
