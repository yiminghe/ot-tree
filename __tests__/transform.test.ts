import { type, insertOp, moveOp, removeOp } from '../src/';
import { prettyJson } from './utils';

const { transform } = type;

const rightSide = 'right';
const leftSide = 'left';

describe('transform', () => {
  it('insert vs insert works', () => {
    expect(
      prettyJson(
        transform(insertOp([0, 0, 0]), insertOp([0, 1, 0]), rightSide),
      ),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            0,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(
      prettyJson(
        transform(insertOp([0, 1, 0]), insertOp([0, 0, 0]), rightSide),
      ),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            1,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(prettyJson(transform(insertOp([0, 0]), insertOp([0, 1]), rightSide)))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(prettyJson(transform(insertOp([0, 1]), insertOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            2
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(prettyJson(transform(insertOp([0, 0]), insertOp([0, 0]), rightSide)))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            1
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(prettyJson(transform(insertOp([0, 0]), insertOp([0, 0]), leftSide)))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(
      prettyJson(transform(insertOp([0, 0]), insertOp([0, 1, 0]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(
      prettyJson(transform(insertOp([0, 1, 0]), insertOp([0, 0]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            2,
            0
          ],
          'newNode': {}
        }
      ]"
    `);

    expect(
      prettyJson(transform(insertOp([0, 1, 0]), insertOp([0, 1]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'insert_node',
          'path': [
            0,
            2,
            0
          ],
          'newNode': {}
        }
      ]"
    `);
  });

  it('remove vs remove works', () => {
    expect(
      prettyJson(transform(removeOp([0, 1, 0]), removeOp([0, 1]), rightSide)),
    ).toMatchInlineSnapshot(`"[]"`);

    expect(
      prettyJson(transform(removeOp([0, 1]), removeOp([0, 1, 0]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            1
          ]
        }
      ]"
    `);

    expect(
      prettyJson(
        transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), rightSide),
      ),
    ).toMatchInlineSnapshot(`"[]"`);

    expect(
      prettyJson(transform(removeOp([0, 1, 1]), removeOp([0, 1, 1]), leftSide)),
    ).toMatchInlineSnapshot(`"[]"`);

    expect(
      prettyJson(transform(removeOp([0, 1, 0]), removeOp([0, 0]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            0,
            0
          ]
        }
      ]"
    `);

    expect(
      prettyJson(transform(removeOp([0, 0]), removeOp([0, 1, 0]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            0
          ]
        }
      ]"
    `);

    expect(
      prettyJson(transform(removeOp([0, 2, 2]), removeOp([0, 1]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            1,
            2
          ]
        }
      ]"
    `);

    expect(
      prettyJson(transform(removeOp([0, 1]), removeOp([0, 2, 2]), rightSide)),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            1
          ]
        }
      ]"
    `);

    expect(
      prettyJson(
        transform(removeOp([0, 2, 2]), removeOp([0, 1, 1]), rightSide),
      ),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            2,
            2
          ]
        }
      ]"
    `);

    expect(
      prettyJson(
        transform(removeOp([0, 1, 1]), removeOp([0, 2, 2]), rightSide),
      ),
    ).toMatchInlineSnapshot(`
      "[
        {
          'type': 'remove_node',
          'path': [
            0,
            1,
            1
          ]
        }
      ]"
    `);
  });

  it('move vs move works', () => {
    let op1 = moveOp([0, 1], [0, 3, 3]);
    let op2 = moveOp([0, 2], [0, 3, 4]);

    expect(prettyJson(transform(op1, op2, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            3
          ]
        }
      ]"
    `);

    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            5
          ]
        }
      ]"
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 3, 3]);
    expect(transform(op2, op1, rightSide)).toMatchInlineSnapshot(`Array []`);
    expect(transform(op2, op1, leftSide)).toMatchInlineSnapshot(`Array []`);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 1], [0, 2, 3]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            2,
            3
          ],
          'toPath': [
            0,
            1,
            3
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op2, op1, leftSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            3
          ]
        }
      ]"
    `);

    op1 = moveOp([0, 1], [0, 3, 3]);
    op2 = moveOp([0, 2], [0, 3, 3]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            4
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op2, op1, leftSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            3
          ]
        }
      ]"
    `);

    op1 = moveOp([1], [2]);
    op2 = moveOp([1], [3]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            2
          ],
          'toPath': [
            3
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op2, op1, leftSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            1
          ],
          'toPath': [
            3
          ]
        }
      ]"
    `);

    op1 = moveOp([0, 1], [0, 3]);
    op2 = moveOp([0, 2], [0, 3]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            3
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op1, op2, leftSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2
          ]
        }
      ]"
    `);

    op1 = moveOp([0, 1], [0, 3, 1]);
    op2 = moveOp([0, 2], [0, 3, 1]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            2
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op1, op2, leftSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1
          ],
          'toPath': [
            0,
            2,
            1
          ]
        }
      ]"
    `);

    op1 = moveOp([0, 2, 2], [0, 3, 3]);
    op2 = moveOp([0, 3], [0, 2, 2, 1]);
    expect(prettyJson(transform(op2, op1, rightSide))).toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            3,
            3
          ],
          'toPath': [
            0,
            2,
            2
          ]
        },
        {
          'type': 'move_node',
          'fromPath': [
            0,
            3
          ],
          'toPath': [
            0,
            2,
            2,
            1
          ]
        }
      ]"
    `);
    expect(prettyJson(transform(op1, op2, leftSide))).toMatchInlineSnapshot(
      `"[]"`,
    );
  });
});
