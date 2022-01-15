export interface Sum {
  a: number;
  b: number;
  sum: number;
}

export const add = (a: number, b: number): Sum => ({ a, b, sum: a + b });
