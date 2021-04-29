import { type, moveOp } from "../src/";

const { invert } = type;

describe("invert", () => {
  it("move works", () => {
    expect(invert(moveOp([0, 0], [0, 1, 0]))).toMatchInlineSnapshot(`
      Array [
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
        },
      ]
    `);

    expect(invert(moveOp([0, 0, 0], [0, 0]))).toMatchInlineSnapshot(`
      Array [
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
        },
      ]
    `);

    expect(invert(moveOp([0, 0, 0], [0, 1, 0]))).toMatchInlineSnapshot(`
      Array [
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
        },
      ]
    `);

    expect(invert(moveOp([0, 1, 0], [0, 0, 0]))).toMatchInlineSnapshot(`
      Array [
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
        },
      ]
    `);
  });
});
