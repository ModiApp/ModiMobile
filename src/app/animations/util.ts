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
