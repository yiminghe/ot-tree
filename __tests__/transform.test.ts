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
    expect(wrap(transform(insertOp([0, 0, 0]), insertOp([0, 1, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            0,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 1, 0]), insertOp([0, 0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            1,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 1]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 1]), insertOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            2,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            1,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 0]), leftSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 0]), insertOp([0, 1, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 1, 0]), insertOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            2,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);

    expect(wrap(transform(insertOp([0, 1, 0]), insertOp([0, 1]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "newNode": Object {},
          "path": Array [
            0,
            2,
            0,
          ],
          "type": "insert_node",
        },
      ]
    `);
  });

  it("remove vs remove works", () => {
    expect(
      wrap(transform(removeOp([0, 1, 0]), removeOp([0, 1]), rightSide))
    ).toMatchInlineSnapshot(`Array []`);

    expect(wrap(transform(removeOp([0, 1]), removeOp([0, 1, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            1,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(
      wrap(transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), rightSide))
    ).toMatchInlineSnapshot(`Array []`);

    expect(
      wrap(transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), leftSide))
    ).toMatchInlineSnapshot(`Array []`);

    expect(wrap(transform(removeOp([0, 1, 0]), removeOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            0,
            0,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(wrap(transform(removeOp([0, 0]), removeOp([0, 1, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            0,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(wrap(transform(removeOp([0, 2, 2]), removeOp([0, 1]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            1,
            2,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(wrap(transform(removeOp([0, 1]), removeOp([0, 2, 2]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            1,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(wrap(transform(removeOp([0, 2, 2]), removeOp([0, 1, 1]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            2,
            2,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);

    expect(wrap(transform(removeOp([0, 1, 1]), removeOp([0, 2, 2]), rightSide)))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "path": Array [
            0,
            1,
            1,
          ],
          "removedNode": undefined,
          "type": "remove_node",
        },
      ]
    `);
  });

  it("move vs move works", () => {
    let op1 = moveOp([0, 1], [0, 3, 3]);
    let op2 = moveOp([0, 2], [0, 3, 4]);

    expect(transform(op1, op2, rightSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);

    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 3, 3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`Array []`);
    expect(transform(op2, op1, leftSide)).toMatchInlineSnapshot(`Array []`);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 2, 3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 2], [0, 3, 3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);

    op1 = moveOp([1], [2]);
    op2 = moveOp([1], [3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fromPath": Array [
            2,
          ],
          "toPath": Array [
            3,
          ],
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op2, op1, leftSide)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fromPath": Array [
            1,
          ],
          "toPath": Array [
            3,
          ],
          "type": "move_node",
        },
      ]
    `);

    op1 = moveOp([0, 1], [0, 3]);
    op2 = moveOp([0, 2], [0, 3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fromPath": Array [
            0,
            1,
          ],
          "toPath": Array [
            0,
            3,
          ],
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op1, op2, leftSide)).toMatchInlineSnapshot(`
      Array [
        Object {
          "fromPath": Array [
            0,
            1,
          ],
          "toPath": Array [
            0,
            2,
          ],
          "type": "move_node",
        },
      ]
    `);

    op1 = moveOp([0, 1], [0, 3, 1]);
    op2 = moveOp([0, 2], [0, 3, 1]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
    `);
    expect(transform(op1, op2, leftSide)).toMatchInlineSnapshot(`
      Array [
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
          "type": "move_node",
        },
      ]
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
