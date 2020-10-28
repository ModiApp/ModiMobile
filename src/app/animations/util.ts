import { range } from '@modi/ui/util';

/** Takes a fromRotation radians value, this is like the zero
 * Takes a toRotation raidans value,
 */

export function normalizeAngle(angle: number) {
  let newAngle = angle % Math.PI;

  newAngle = (newAngle + Math.PI * 2) % (Math.PI * 2);
  if (newAngle > Math.PI) newAngle -= Math.PI * 2;

  return newAngle;
}

/** Sizes cards so any number of them fit nicely together on the table */
export function calcCardHeight(numCards: number, tableHeight: number) {
  return range(2, 20, 0.32, 0.12, numCards) * tableHeight;
}

export function generateRandomCardMap(): CardMap {
  const numCards = Math.floor(Math.random() * 16) + 4;
  return Array(numCards)
    .fill(null)
    .map((_, idx) => {
      if (idx === 0) {
        return {
          suit: ['spades', 'hearts', 'clubs', 'diamonds'][
            Math.floor(Math.random() * 4)
          ],
          rank: Math.floor(Math.random() * 13) + 1,
        } as Card;
      }
      return true;
    });
}
