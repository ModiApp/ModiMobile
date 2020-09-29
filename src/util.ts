import axios from 'axios';
import { API_URL } from '@modi/env.json';

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

/** ### GroupSort
 * Sorts an array of elements by group in ascending order.
 *
 * @param {any[]} elems The list of elements to group sort
 *
 * @param {function} valueExtractor a method to
 * run on each elem to numerically evalutate them
 *
 * @returns {any[][]} A 2-d array, of the elements grouped
 * by value in ascending order.
 */
export function groupSort<T>(
  elems: T[],
  valueExtractor: (el: T) => number,
): T[][] {
  const groups: { [value: number]: T[] } = {};

  elems.forEach((el) => {
    const value = valueExtractor(el);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(el);
  });

  const sortedGroups = Object.entries(groups)
    .sort(([aValue], [bValue]) => Number(aValue) - Number(bValue))
    .map(([_, el]) => el);

  return sortedGroups;
}
