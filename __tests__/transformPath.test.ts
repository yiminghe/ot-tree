import { transformPathWhenMove } from '../src/utils';

describe('transformPath', () => {
  it('transformPathWhenMove works', () => {
    expect(transformPathWhenMove([5], [1], [5])).toMatchInlineSnapshot(`
      Array [
        4,
      ]
    `);

    expect(transformPathWhenMove([5, 0], [1], [5, 0])).toMatchInlineSnapshot(`
      Array [
        4,
        1,
      ]
    `);

    expect(transformPathWhenMove([1, 1], [1, 1], [1])).toMatchInlineSnapshot(`
      Array [
        1,
      ]
    `);

    expect(transformPathWhenMove([2], [1], [2])).toMatchInlineSnapshot(`
      Array [
        1,
      ]
    `);
  });
});
