import { describe, it, expect } from "vitest";
import { partition, chunk, rotate } from "./utils";

describe("utils tests", () => {
  it("should partition array", () => {
    const data = partition([1, 2, 3], 2, 7);
    expect(data).toEqual([
      [1, 2],
      [2, 3],
      [3, 1],
      [1, 2],
      [2, 3],
      [3, 1],
      [1, 2],
    ]);
  });

  it("should partition array at the given offset", () => {
    const data = partition([1, 2, 3], 2, 4, 1);
    expect(data).toEqual([
      [2, 3],
      [3, 1],
      [1, 2],
      [2, 3],
    ]);
  });

  it("should chunk an array into the given chunks", () => {
    const a = [1, 2, 3];

    expect(chunk(a, 0, 2)).toEqual([1, 2]);
    expect(chunk(a, 1, 2)).toEqual([2, 3]);
    expect(chunk(a, 2, 2)).toEqual([3, 1]);
    expect(chunk(a, 3, 2)).toEqual([1, 2]);
    expect(chunk(a, 4, 2)).toEqual([2, 3]);
    expect(chunk(a, 5, 2)).toEqual([3, 1]);
    expect(chunk(a, 6, 2)).toEqual([1, 2]);
    expect(chunk(a, 7, 2)).toEqual([2, 3]);
  });

  it("should rotate an array", () => {
    const a = [1, 2, 3];
    expect(rotate(a, 0)).toEqual([1, 2, 3]);
    expect(rotate(a, 1)).toEqual([2, 3, 1]);
    expect(rotate(a, 2)).toEqual([3, 1, 2]);
    expect(rotate(a, 3)).toEqual([1, 2, 3]);
  });
});
