/** Takes a fromRotation radians value, this is like the zero
 * Takes a toRotation raidans value,
 */

export function normalizeAngle(angle: number) {
  let newAngle = angle % Math.PI;

  newAngle = (newAngle + Math.PI * 2) % (Math.PI * 2);
  if (newAngle > Math.PI) newAngle -= Math.PI * 2;

  return newAngle;
}
