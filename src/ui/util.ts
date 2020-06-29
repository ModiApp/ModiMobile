/** returns the value between two numbers at a specified, decimal midpoint */
export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

/** returns the percentage that a is between x and y */
export const invlerp = (x: number, y: number, a: number) =>
  clamp((a - x) / (y - x));

/** ensures a will be limited to range min-max */
export const clamp = (a: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, a));

/** converts a value from one data range to another */
export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number,
) => lerp(x2, y2, invlerp(x1, y1, a));
