declare interface Card {
  suit: 'spades' | 'clubs' | 'hearts' | 'diamonds';
  rank: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  value: () => number;
}
declare type PlayerId = string;

/** Value will be a boolean for all players except yourself */
declare type CardMap = Map<PlayerId, boolean | Card>;

/** When the adjacent player has a king, this player's swap will be an attempted-swap */
declare type PlayerMove = 'stick' | 'swap' | 'attempted-swap';

declare type ModiGameState = {
  /** What round the game is currently up to */
  round: number;

  /** The id of this round's dealer */
  dealerId: PlayerId;

  /** The ```ModiGameState.playerOrder[activePlayerIdx]``` is the player whose turn it is */
  activePlayerIdx: number;

  /** A map of player ids to whether or not they have a card */
  playersCards: CardMap;

  /** An array of playerIds and their moves for this round */
  moves: [PlayerId, PlayerMove][];

  /** A map of player ids and their live counts */
  liveCounts: [PlayerId, number][];

  /** Starts each round as as [0, 1, 2, ... numPlayers - 1], changes as players trade */
  cardOrder: number[];

  /** Changes each round, as dealer moves left. Dealer is last. */
  playerOrder: PlayerId[];
};

declare type ModiAppState = {
  username?: string;
  currentLobbyId?: string;
  currentGameId?: string;
  authorizedPlayerId?: string;
};

declare type AppContextType = [
  ModiAppState,
  (updates: ModiAppState) => Promise<void>
];

declare type GameStateChangeAction =
  | { type: 'set entire state'; payload: ModiGameState }
  | { type: 'card order changed'; payload: number[] }
  | { type: 'live counts changed'; payload: [PlayerId, number][] }
  | { type: 'player order changed'; payload: PlayerId[] };

declare interface GameServiceConfig {
  /** The id of the game namespace you're trying to connect to */
  gameId: string;

  /** One of the player ids that this game has authorized */
  authorizedPlayerId: string;

  /** The string that will be used to identify you to other players */
  username: string;

  /** Triggered when any of ModiGameState's properties change */
  onGameStateChanged: (action: GameStateChangeAction) => void;
}
