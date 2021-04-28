# ot-tree
The Tree OT type can be used to edit arbitrary Tree Structure.

It follows https://github.com/ottypes/docs, can be used with sharedb.

## Usage

```
# npm add ot-tree
```

then use it like any other OT type:

```javascript
const { type, insertOp } = require('ot-tree')

type.apply([
    { children:[ {data: { name: '0' } } ] }
], insertOp([0,1],{data:{name:'new'}}));
// =>
/*
[
{
    children:[
        {
            data: { name: '0' }
        },
        {
            data: { name: 'new' }
        }
    ]
}
]
*/
```