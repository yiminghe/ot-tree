# Tree OT Type

The Tree OT type can be used to edit arbitrary Tree Structure.

For documentation on the spec this type implements, see [ottypes/docs](https://github.com/ottypes/docs), so it can be used with [sharedb](https://github.com/share/sharedb).

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