export interface Sum {
  a: number;
  b: number;
  sum: number;
}

export const add = (a: number, b: number): Sum => ({ a, b, sum: a + b });

export interface Diff {
  a: number;
  b: number;
  diff: number;
}

export const remove = (a: number, b: number): Diff => ({ a, b, diff: a - b });
