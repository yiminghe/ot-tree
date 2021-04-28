import { type, insertOp, moveOp, removeOp } from "../src/";
import { TreeOp } from "../src/types";
import { pick } from "lodash";

const { transform } = type;

function wrap(a: any) {
  return a;
}

const rightSide = "right";
const leftSide = "left";

describe("transform", () => {
  it("insert vs insert works", () => {
    expect(
      wrap(transform(insertOp([0, 0, 0]), insertOp([0, 1, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        0,
        0,
      ]
    `);

    expect(
      wrap(transform(insertOp([0, 1, 0]), insertOp([0, 0, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        1,
        0,
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 1]), rightSide)).path)
      .toMatchInlineSnapshot(`
      Array [
        0,
        0,
      ]
    `);

    expect(wrap(transform(insertOp([0, 1]), insertOp([0, 0]), rightSide)).path)
      .toMatchInlineSnapshot(`
      Array [
        0,
        2,
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 0]), rightSide)).path)
      .toMatchInlineSnapshot(`
      Array [
        0,
        1,
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 0]), leftSide)).path)
      .toMatchInlineSnapshot(`
        Array [
          0,
          0,
        ]
    `);

    expect(
      wrap(transform(insertOp([0, 0]), insertOp([0, 1, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        0,
      ]
    `);

    expect(
      wrap(transform(insertOp([0, 1, 0]), insertOp([0, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        2,
        0,
      ]
    `);

    expect(
      wrap(transform(insertOp([0, 1, 0]), insertOp([0, 1]), rightSide)).path
    ).toMatchInlineSnapshot(`
        Array [
          0,
          2,
          0,
        ]
      `);
  });

  it("remove vs remove works", () => {
    expect(
      wrap(transform(removeOp([0, 1, 0]), removeOp([0, 1]), rightSide)).path
    ).toMatchInlineSnapshot(`undefined`);

    expect(
      wrap(transform(removeOp([0, 1]), removeOp([0, 1, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        1,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), rightSide)).path
    ).toMatchInlineSnapshot(`undefined`);

    expect(
      wrap(transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), leftSide)).path
    ).toMatchInlineSnapshot(`undefined`);

    expect(
      wrap(transform(removeOp([0, 1, 0]), removeOp([0, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        0,
        0,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 0]), removeOp([0, 1, 0]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        0,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 2, 2]), removeOp([0, 1]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        1,
        2,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 1]), removeOp([0, 2, 2]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        1,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 2, 2]), removeOp([0, 1, 1]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        2,
        2,
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 1, 1]), removeOp([0, 2, 2]), rightSide)).path
    ).toMatchInlineSnapshot(`
      Array [
        0,
        1,
        1,
      ]
    `);
  });

  it("move vs move works", () => {
    let op1 = moveOp([0, 1], [0, 3, 3]);
    let op2 = moveOp([0, 2], [0, 3, 4]);

    function getMoveTransform(op1: TreeOp, op2: TreeOp, side: any) {
      return pick(transform(op1, op2, side), ["fromPath", "toPath"]);
    }

    expect(getMoveTransform(op1, op2, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          3,
        ],
      }
    `);

    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          5,
        ],
      }
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 3, 3]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(
      `Object {}`
    );
    expect(getMoveTransform(op2, op1, leftSide)).toMatchInlineSnapshot(
      `Object {}`
    );

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 2, 3]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          2,
          3,
        ],
        "toPath": Array [
          0,
          1,
          3,
        ],
      }
    `);
    expect(getMoveTransform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          3,
        ],
      }
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 2], [0, 3, 3]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          4,
        ],
      }
    `);
    expect(getMoveTransform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          3,
        ],
      }
    `);

    op1 = moveOp([1], [2]);
    op2 = moveOp([1], [3]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          2,
        ],
        "toPath": Array [
          3,
        ],
      }
    `);
    expect(getMoveTransform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          1,
        ],
        "toPath": Array [
          3,
        ],
      }
    `);

    op1 = moveOp([0, 1], [0, 3]);
    op2 = moveOp([0, 2], [0, 3]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          3,
        ],
      }
    `);
    expect(getMoveTransform(op1, op2, leftSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
        ],
      }
    `);

    op1 = moveOp([0, 1], [0, 3, 1]);
    op2 = moveOp([0, 2], [0, 3, 1]);
    expect(getMoveTransform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          2,
        ],
      }
    `);
    expect(getMoveTransform(op1, op2, leftSide)).toMatchInlineSnapshot(`
      Object {
        "fromPath": Array [
          0,
          1,
        ],
        "toPath": Array [
          0,
          2,
          1,
        ],
      }
    `);

    op1 = moveOp([0, 2, 2], [0, 3, 3]);
    op2 = moveOp([0, 3], [0, 2, 2, 1]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fromPath": Array [
            0,
            3,
            3,
          ],
          "toPath": Array [
            0,
            2,
            2,
          ],
          "type": "move_node",
        },
        Object {
          "fromPath": Array [
            0,
            3,
          ],
          "toPath": Array [
            0,
            2,
            2,
            1,
          ],
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op1, op2, leftSide)).toMatchInlineSnapshot(`Array []`);
  });
});
