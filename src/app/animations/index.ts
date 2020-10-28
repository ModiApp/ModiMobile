export default function animateFromAction(
  controller: GameScreenController,
  initialState: GameState,
  stateChageAction: StateChangeAction,
): Promise<void> {
  const { orderedPlayerIds } = initialState;

  switch (stateChageAction.type) {
    case 'DEALT_CARDS': {
      const cardMap = generateCardMapFromDealtCards(
        stateChageAction.payload.cards,
        orderedPlayerIds,
      );
      return new Promise((r) => controller.dealCards(cardMap, r));
    }
    case 'HIGHCARD_WINNERS': {
      const winnerIds = stateChageAction.payload.playerIds;
      const winnerIdxs = winnerIds.map((id) =>
        orderedPlayerIds.findIndex((pid) => pid === id),
      );
      return new Promise((r) =>
        controller.highlightCards(winnerIdxs, 'yellow', r),
      );
    }
    case 'REMOVE_CARDS': {
      return new Promise(controller.trashCards);
    }
    default:
      return Promise.resolve();
  }
}

function generateCardMapFromDealtCards(
  dealtCards: [Card, string][],
  playerOrder: string[],
): CardMap {
  const playerCards: { [playerId: string]: Card | boolean } = {};
  dealtCards.forEach(([card, playerId]) => (playerCards[playerId] = card));
  return playerOrder.map((playerId) => playerCards[playerId] || false);
}
