import { type, moveOp } from '../src/';
import { prettyJson } from './utils';

const { invert } = type;

describe('invert', () => {
  it('move works', () => {
    expect(prettyJson(invert(moveOp([0, 0], [0, 1, 0]))))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            0,
            0
          ],
          'toPath': [
            0,
            0
          ]
        }
      ]"
    `);

    expect(prettyJson(invert(moveOp([0, 0, 0], [0, 0]))))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            0
          ],
          'toPath': [
            0,
            1,
            0
          ]
        }
      ]"
    `);

    expect(prettyJson(invert(moveOp([0, 0, 0], [0, 1, 0]))))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            1,
            0
          ],
          'toPath': [
            0,
            0,
            0
          ]
        }
      ]"
    `);

    expect(prettyJson(invert(moveOp([0, 1, 0], [0, 0, 0]))))
      .toMatchInlineSnapshot(`
      "[
        {
          'type': 'move_node',
          'fromPath': [
            0,
            0,
            0
          ],
          'toPath': [
            0,
            1,
            0
          ]
        }
      ]"
    `);
  });
});
