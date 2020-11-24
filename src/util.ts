import axios from 'axios';
import { API_URL } from '@modimobile/env.json';

export async function validateLobbyId(lobbyId: string): Promise<boolean> {
  try {
    await axios.head(`${API_URL}/lobbies/${lobbyId}`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function validateGameId(gameId: string): Promise<boolean> {
  try {
    await axios.head(`${API_URL}/games/${gameId}`);
    return true;
  } catch (e) {
    return false;
  }
}

export function createLobby(): Promise<string> {
  return axios.get(`${API_URL}/lobbies/new`).then((res) => res.data.lobbyId);
}

export function cardsAreEqual(
  card1: Card | undefined,
  card2: Card | undefined,
) {
  console.table([
    ['rank', 'suit'],
    [card1?.rank, card1?.suit],
    [card2?.rank, card2?.suit],
  ]);
  if (!card1 && !card2) {
    return true;
  } else if (!card1 || !card2) {
    return card1 !== card2;
  }
  return card1.rank === card2.rank && card1.suit === card2.suit;
}

export class Queue<T> {
  private head: QueueNode<T> | undefined = undefined;
  private tail: QueueNode<T> | undefined = undefined;
  public length: number;

  constructor(elems?: T[]) {
    elems?.forEach((elem) => this.enqueue(elem));
    this.length = elems?.length || 0;
  }

  enqueue(elem: T) {
    const newNode = new QueueNode(elem);
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.length += 1;
  }

  dequeue() {
    if (this.length === 0) {
      throw new Error('Cannot dequeue. Queue is empty.');
    }
    const value = this.head!.value;
    if (this.length > 1) {
      this.head = this.head!.next!;
    } else if (this.length === 1) {
      this.head = undefined;
      this.tail = undefined;
    }
    this.length -= 1;
    return value;
  }

  get last() {
    return this.tail?.value;
  }

  get next() {
    return this.head?.value;
  }
}

class QueueNode<T> {
  public value: T;
  public next: QueueNode<T> | undefined;
  constructor(value: T) {
    this.value = value;
  }
}

export function getPlayerCard(gameState: ModiGameState, playerId: string) {
  return gameState.players.find((player) => player.id === playerId)?.card;
}
