import { type } from "../src/";
import { MoveNodeOperation, Path } from "../src/types";

const { invert } = type;

function getMoveOp(fromPath: Path, toPath: Path): MoveNodeOperation {
  return {
    type: "move_node",
    fromPath,
    toPath,
  };
}

describe("invert", () => {
  it("move works", () => {
    expect(invert(getMoveOp([0, 0], [0, 1, 0]))).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          0,
          0,
        ],
        "toPath": Array [
          0,
          0,
        ],
        "type": "move_node",
      }
    `);

    expect(invert(getMoveOp([0, 0, 0], [0, 0]))).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          0,
        ],
        "toPath": Array [
          0,
          1,
          0,
        ],
        "type": "move_node",
      }
    `);

    expect(invert(getMoveOp([0, 0, 0], [0, 1, 0]))).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
          0,
        ],
        "toPath": Array [
          0,
          0,
          0,
        ],
        "type": "move_node",
      }
    `);

    expect(invert(getMoveOp([0, 1, 0], [0, 0, 0]))).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          0,
          0,
        ],
        "toPath": Array [
          0,
          1,
          0,
        ],
        "type": "move_node",
      }
    `);
  });
});
