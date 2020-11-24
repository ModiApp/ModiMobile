import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { connectToGameSocket } from '@modiapp/client';

import { API_URL } from '@modimobile/env.json';
import { useAppState } from '@modimobile/hooks';
import { GameScreen, LoadingScreen } from '@modimobile/ui';

type ControlledGameScreenProps = MainStackScreenProps<'Game'>;
const ControlledGameScreen: React.FC<ControlledGameScreenProps> = ({
  navigation,
}) => {
  const cardMapRef = useRef<CardTableController>(null);
  const buttonsRef = useRef<BottomButtonsController>(null);

  const [connections, setConnections] = useState<ConnectionResponseDto>([]);
  const [{ gameAccessToken }] = useAppState();

  const orderedPlayerIds = useMemo(() => {
    return connections.map(({ playerId }) => playerId);
  }, [connections.length]);

  const animateFromGameEvent = useAnimationHandler(
    gameAccessToken!,
    orderedPlayerIds,
    cardMapRef.current!,
    buttonsRef.current!,
  );

  const onGameEvent: StateChangeCallback = useCallback(
    (event, version) => {
      /** @TODO store the latest version in app state */
      console.log('GAME EVENT', event, version);
      animateFromGameEvent(event);
    },
    [animateFromGameEvent],
  );

  const gameSocketCallbacks: GameRoomClientCallbacks = useMemo(
    () => ({
      onConnectionsChanged: setConnections,
      onDisconnect: () => {},
      onStateChange: onGameEvent,
      onError: () => {},
    }),
    [setConnections, onGameEvent],
  );

  const gameSocketConfig = useGameClientConfig(gameSocketCallbacks);
  const gameRoomClient = useGameRoomClient(gameSocketConfig);
  const buttonCallbacks = useMemo<BottomButtonsCallbacks>(
    () => ({
      onStartHighcardBtnPressed: () => gameRoomClient!.initiateHighcard(),
      onDealCardsBtnPressed: () => gameRoomClient!.dealCards(),
      onPlayAgainBtnPressed: () => {},
      onStickBtnPressed: () => gameRoomClient!.makeMove('stick'),
      onSwapBtnPressed: () => gameRoomClient!.makeMove('swap'),
      onHomeBtnPressed() {},
    }),
    [gameRoomClient],
  );

  if (!gameRoomClient) {
    return <LoadingScreen />;
  }

  return (
    <GameScreen
      cardMapRef={cardMapRef}
      buttonsRef={buttonsRef}
      connections={connections}
      buttonCallbacks={buttonCallbacks}
    />
  );
};

function useGameClientConfig(controller: GameRoomClientCallbacks) {
  const [{ username, gameAccessToken, currGameId }] = useAppState();

  const config: GameSocketConfig = {
    url: API_URL + '/games/' + currGameId,
    username: username!,
    playerId: gameAccessToken!,
    ...controller,
  };

  return config;
}

function useGameRoomClient(config: GameSocketConfig) {
  const [
    gameRoomClient,
    setGameRoomClient,
  ] = useState<GameRoomClientController | null>(null);

  useEffect(() => {
    connectToGameSocket(config).then(setGameRoomClient);
  }, []);

  return gameRoomClient;
}

function useAnimationHandler(
  currPlayerId: string,
  orderedPlayerIds: string[],
  cardTable: CardTableController,
  bottomButtons: BottomButtonsController,
) {
  const runAnimation = useCallback(
    (action: StateChangeAction, onComplete?: () => void) => {
      console.log('run animation was called with action!!', action);
      switch (action.type) {
        case 'PLAYERS_TURN': {
          console.log('we are animating the players turn event!!');
          const { playerId, controls } = action.payload;
          if (playerId === currPlayerId) {
            console.log('showing controls fro playerId', currPlayerId);
            bottomButtons.showControls(controls);
          }
          const playerIdx = orderedPlayerIds.findIndex((id) => id === playerId);
          return cardTable.highlightCards([playerIdx], 'yellow', onComplete);
        }
        case 'DEALT_CARDS': {
          const { cards, dealerId } = action.payload;
          const dealerIdx = orderedPlayerIds.findIndex(
            (playerId) => playerId === dealerId,
          );
          return cardTable.dealCards(cards, dealerIdx, onComplete);
        }
        case 'HIGHCARD_WINNERS':
          const { playerIds } = action.payload;
          const playerIndices = playerIds.map((playerIdToFind) =>
            orderedPlayerIds.findIndex(
              (playerId) => playerId === playerIdToFind,
            ),
          );
          return cardTable.highlightCards(playerIndices, 'green', onComplete);

        case 'REMOVE_CARDS':
          return cardTable.trashCards(onComplete);

        default:
          return onComplete && onComplete();
      }
    },
    [currPlayerId, cardTable, bottomButtons, orderedPlayerIds],
  );

  const eventQueue = useRef<StateChangeAction[]>([]).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasMoreInQueue, setHasMoreInQueue] = useState(false);
  useEffect(() => {
    if (
      eventQueue.length > 0 &&
      !isAnimating &&
      !!cardTable &&
      !!bottomButtons
    ) {
      setIsAnimating(true);
      runAnimation(eventQueue.shift()!, () => setIsAnimating(false));
    } else {
      setHasMoreInQueue(false);
    }
  }, [hasMoreInQueue, isAnimating, cardTable, bottomButtons]);

  const enqueGameEvent = useCallback(
    (event: StateChangeAction) => {
      !hasMoreInQueue && setHasMoreInQueue(true);
      eventQueue.push(event);
    },
    [hasMoreInQueue],
  );

  return enqueGameEvent;
}

export default ControlledGameScreen;
