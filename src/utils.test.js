import { partition, chunk } from "./utils";
import { assert } from "chai";

describe("utils tests", () => {
  it("should partition array", () => {
    const data = partition([1, 2, 3], 2, 7);
    assert.deepEqual(data, [
      [1, 2],
      [2, 3],
      [3, 1],
      [1, 2],
      [2, 3],
      [3, 1],
      [1, 2],
    ]);
  });

  it("should chunk an array into the given chunks", () => {
    const a = [1, 2, 3];

    assert.deepEqual(chunk(a, 0, 2), [1, 2]);
    assert.deepEqual(chunk(a, 1, 2), [2, 3]);
    assert.deepEqual(chunk(a, 2, 2), [3, 1]);
    assert.deepEqual(chunk(a, 3, 2), [1, 2]);
    assert.deepEqual(chunk(a, 4, 2), [2, 3]);
    assert.deepEqual(chunk(a, 5, 2), [3, 1]);
    assert.deepEqual(chunk(a, 6, 2), [1, 2]);
    assert.deepEqual(chunk(a, 7, 2), [2, 3]);
  });
});
