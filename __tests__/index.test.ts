import { type, insertOp, moveOp, editOp, removeOp } from '../src/';
import { prettyJson } from './utils';

describe('usage', () => {
  it('works', () => {
    let ret = type.apply(
      [
        { children: [{ data: { name: '0' } }] },
        { children: [{ data: { name: '1' } }] },
      ],
      insertOp([0, 1], { data: { name: 'new' } }),
    );

    expect(prettyJson(ret)).toMatchInlineSnapshot(`
      "[
        {
          'children': [
            {
              'data': {
                'name': '0'
              }
            },
            {
              'data': {
                'name': 'new'
              }
            }
          ]
        },
        {
          'children': [
            {
              'data': {
                'name': '1'
              }
            }
          ]
        }
      ]"
    `);

    ret = type.apply(
      [
        { children: [{ data: { name: '0' } }] },
        { children: [{ data: { name: '1' } }] },
      ],
      editOp([0, 0], { name: 'new' }),
    );

    expect(prettyJson(ret)).toMatchInlineSnapshot(`
      "[
        {
          'children': [
            {
              'data': {
                'name': 'new'
              }
            }
          ]
        },
        {
          'children': [
            {
              'data': {
                'name': '1'
              }
            }
          ]
        }
      ]"
    `);

    ret = type.apply(
      [
        { children: [{ data: { name: '0' } }] },
        { children: [{ data: { name: '1' } }] },
      ],
      removeOp([0, 0], { data: { name: '0' } }),
    );

    expect(prettyJson(ret)).toMatchInlineSnapshot(`
      "[
        {
          'children': []
        },
        {
          'children': [
            {
              'data': {
                'name': '1'
              }
            }
          ]
        }
      ]"
    `);

    ret = type.apply(
      [
        { children: [{ data: { name: '0' } }] },
        { children: [{ data: { name: '1' } }] },
      ],
      moveOp([1, 0], [0, 0, 0]),
    );

    expect(prettyJson(ret)).toMatchInlineSnapshot(`
      "[
        {
          'children': [
            {
              'data': {
                'name': '0'
              },
              'children': [
                {
                  'data': {
                    'name': '1'
                  }
                }
              ]
            }
          ]
        },
        {
          'children': []
        }
      ]"
    `);
  });

  it('can create children', () => {
    const ret = type.apply(
      [{ children: [{ data: { name: '0' } }] }],
      insertOp([0, 0, 1], { data: { name: 'new' } }),
    );

    expect(prettyJson(ret)).toMatchInlineSnapshot(`
      "[
        {
          'children': [
            {
              'data': {
                'name': '0'
              },
              'children': [
                {
                  'data': {
                    'name': 'new'
                  }
                }
              ]
            }
          ]
        }
      ]"
    `);
  });
});
