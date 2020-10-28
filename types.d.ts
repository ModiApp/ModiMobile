declare type CardSuit = 'spades' | 'clubs' | 'hearts' | 'diamonds';
declare type CardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
declare interface Card {
  suit: CardSuit;
  rank: CardRank;
}
declare type PlayerId = string;

interface GameScreenController {
  dealCards(cardMap: CardMap, onComplete?: () => void): void;
  trashCards(onComplete?: () => void): void;
  highlightCards(indexes: number[], color: string, onComplete?: () => void): void;
  setCards(newCardMap: CardMap): void;
}

declare type CardMap = (Card | boolean)[];
declare type AnimatedCard = {
  position: import('react-native').Animated.ValueXY;
  rotation: import('react-native').Animated.Value;
  dimensions: { width: number; height: number };
  value: Card | boolean;
  borderColor: string | null;
}

type PlayerMove = 'swap' | 'stick' | 'hit deck';
type AdjustedPlayerMove = PlayerMove | 'attempted-swap';

declare type GameState = {
  players: { [playerId: string]: Player };
  orderedPlayerIds: string[];
  dealerId: string | null;
  activePlayerId: string | null;
  version: number;
};

interface Player {
  id: string;
  lives: number;
  card: Card | null;
  move: AdjustedPlayerMove | null;
}

type StateChangeCallback = (action: StateChangeAction, version: number) => void;

declare type StateChangeAction =
  | { type: 'HIGHCARD_WINNERS'; payload: { playerIds: string[] } }
  | {
      type: 'START_ROUND';
      payload: { dealerId: string; activePlayerId: string };
    }
  | { type: 'DEALT_CARDS'; payload: { cards: [Card, string][] } }
  | { type: 'REMOVE_CARDS' }
  | { type: 'PLAYER_HIT_DECK'; payload: { playerId: string; card: Card } }
  | {
      type: 'PLAYERS_TRADED';
      payload: { fromPlayerId: string; toPlayerId: string };
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
  me: Player | undefined;

  /** Whether or not it is the authenticated players turn */
  isMyTurn: boolean;

  isEndOfGame: boolean;

  activePlayerIdx: number | undefined;
}
type GameStateContextType = GameState & {
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
