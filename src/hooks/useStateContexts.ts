import { useContext } from 'react';

import {
  AppStateContext,
  GameStateContext,
  LobbyStateContext,
} from '@modi/providers';

export function useAppState() {
  return useContext(AppStateContext);
}

export function useGameState() {
  return useContext(GameStateContext);
}

export function useLobbyState() {
  return useContext(LobbyStateContext);
}
