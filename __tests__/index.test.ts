import { type, insertOp } from '../src/';

describe('usage', () => {
  it('works', () => {
    const ret = type.apply(
      [{ children: [{ data: { name: '0' } }] }],
      insertOp([0, 1], { data: { name: 'new' } }),
    );

    expect(ret).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "data": Object {
                "name": "0",
              },
            },
            Object {
              "data": Object {
                "name": "new",
              },
            },
          ],
        },
      ]
    `);
  });

  it('can create children', () => {
    const ret = type.apply(
      [{ children: [{ data: { name: '0' } }] }],
      insertOp([0, 0, 1], { data: { name: 'new' } }),
    );

    expect(ret).toMatchInlineSnapshot(`
      Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "data": Object {
                    "name": "new",
                  },
                },
              ],
              "data": Object {
                "name": "0",
              },
            },
          ],
        },
      ]
    `);
  });
});
