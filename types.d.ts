declare type CardSuit = 'spades' | 'clubs' | 'hearts' | 'diamonds';
declare type CardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
declare interface Card {
  suit: CardSuit;
  rank: CardRank;
}
interface BottomButtonsController {
  showControls(type: ControlsType): void;
  hideControls(): void;
}
interface BottomButtonsCallbacks {
  onStartHighcardBtnPressed(): void;
  onDealCardsBtnPressed(): void;
  onPlayAgainBtnPressed(): void;
  onStickBtnPressed(): void;
  onSwapBtnPressed(): void;
  onHomeBtnPressed(): void;
}
interface CardTableController {
  
  dealCards(
    /** comes in with every card except current players as True, false for no card */
    cardMap: TailoredCardMap,
    /** decide which position on the table the cards come from */
    dealerIdx: number,
    
    onComplete?: () => void,
  ): void;
  
  trashCards(onComplete?: () => void): void;
  highlightCards(indexes: number[], color: string, onComplete?: () => void): void;
  setCards(newCardMap: TailoredCardMap): void;
}

declare type CardMap = (Card | boolean)[];
declare type AnimatedCard = {
  position: import('react-native').Animated.ValueXY;
  rotation: import('react-native').Animated.Value;
  dimensions: { width: number; height: number };
  value: Card | boolean;
  borderColor: string | null;
}

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
  JoinGame: undefined
};

type RouteName = 'Home' | 'JoinLobby' | 'Lobby' | 'JoinGame' | 'Game';

interface MainStackScreenProps<RouteName> {
  navigation: import('@react-navigation/stack').StackNavigationProp<MainStackParams, RouteName>;
  route: import('@react-navigation/native').RouteProp<MainStackParams, RouteName>;
}
