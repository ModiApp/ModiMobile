declare type CardSuit = 'spades' | 'clubs' | 'hearts' | 'diamonds';
declare type CardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
declare interface Card {
  suit: CardSuit;
  rank: CardRank;
}
declare type PlayerId = string;

/** Value will be a boolean for all players except yourself */
declare type CardMap = { [playerId: string]: boolean | Card };

/** When the adjacent player has a king, this player's swap will be an attempted-swap */
declare type PlayerMove = 'stick' | 'swap' | 'attempted-swap';

declare type ModiGameState = {
  round: number;

  moves: PlayerMove[];

  players: ModiPlayer[];

  _stateVersion: number;

};

declare type ModiPlayer = {
  id: string;
  username: string;
  lives: number;
  card?: Card;
};
declare type ModiAppState = {
  username: string | undefined;
  currLobbyId: string | undefined;
  currGameId: string | undefined;
  gameAccessToken: string | undefined;
};

declare type AppContextType = [
  ModiAppState,
  AppStateDispatch,
  boolean
];

type GameStateDispatchAction =
  | ['MADE_MOVE', PlayerMove]
  | ['CHOOSE_DEALER', PlayerId]
  | ['PLAY_AGAIN'];

interface TailoredGameState {
  /** The player whose id matches the accessToken on this device */
  me: ModiPlayer | undefined;

  /** Whether or not it is the authenticated players turn */
  isMyTurn: boolean;

  isEndOfGame: boolean;

  activePlayerIdx: number | undefined;
}
type GameStateContextType = ModiGameState & {
  dispatch: (...action: GameStateDispatchAction) => void;
} & TailoredGameState;
declare type AppStateDispatch = {
  /** Sets `username` to provided value */
  setUsername: (username: string) => Promise<void>;
  /** Sets `currLobbyId` to provided value */
  setLobbyId: (lobbyId: string) => Promise<void>;
  /** Sets `currLobbyId` to undefined */
  removeLobbyId: () => Promise<void>;
  /** Sets `currGameId` and `gameAccessToken` */
  setGameCredentials: (gameId: string, accessToken: string) => Promise<void>;
    /** Sets `currGameId` and `gameAccessToken` to undefined */
  removeGameCredentials: () => Promise<void>;
}

type MainStackParams = {
  Home: undefined;
  Lobby: { lobbyId: string | undefined };
  Game: { gameId: string, accessToken: string } | { gameId: undefined, accessToken: undefined };
  JoinLobby: undefined;
};

type RouteName = 'Home' | 'JoinLobby' | 'Lobby' | 'Game';

interface MainStackScreenProps<RouteName> {
  navigation: import('@react-navigation/stack').StackNavigationProp<MainStackParams, RouteName>;
  route: import('@react-navigation/native').RouteProp<MainStackParams, RouteName>;
}
