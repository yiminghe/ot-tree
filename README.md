# Tree OT Type

[![NPM version](https://badge.fury.io/js/ot-tree.png)](http://badge.fury.io/js/ot-tree)
[![NPM downloads](http://img.shields.io/npm/dm/ot-tree.svg)](https://npmjs.org/package/ot-tree)
[![Build Status](https://app.travis-ci.com/yiminghe/ot-tree.svg?branch=main)](https://app.travis-ci.com/github/yiminghe/ot-tree)

The Tree OT type can be used to edit arbitrary Tree Structure.

For documentation on the spec this type implements, see [ottypes/docs](https://github.com/ottypes/docs), so it can be used with [sharedb](https://github.com/share/sharedb).



## Demo

```
yarn
cd examples/sharedb
yarn server // start server
yarn client // start client
```

open: http://localhost:3000/

## Usage

```
# npm install ot-tree
```

then use it like any other OT type:

```javascript
import { type, insertOp, moveOp, editOp, removeOp } from 'ot-tree';

let ret = type.apply(
    [
    { children: [{ data: { name: '0' } }] },
    { children: [{ data: { name: '1' } }] },
    ],
    insertOp([0, 1], { data: { name: 'new' } }),
);

expect((ret)).toMatchInlineSnapshot(`
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

expect((ret)).toMatchInlineSnapshot(`
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

expect((ret)).toMatchInlineSnapshot(`
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

expect((ret)).toMatchInlineSnapshot(`
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

expect((type.transform(insertOp([0, 1, 0]), insertOp([0, 0]), 'right')))
    .toMatchInlineSnapshot(`
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
```