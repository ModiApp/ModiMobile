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
  (updates: Partial<ModiAppState>) => Promise<void>
];