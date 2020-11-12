



declare interface GameStateStore {
  dispatch: (action: StateChangeAction) => GameState;
  getState: () => GameState;
  history: StateChangeAction[];
  initialState: GameState;
}


