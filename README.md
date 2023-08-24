# vanilla-object-parser
Simple vanilla object parser

### Sample schema
```js
const userSchema = {
  user: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      lastName: { type: 'string' },
    },
  },
}
```

### Sample input
```js
const obj = {
  user: {
    name: 'Jhon',
    lastName: 'Wick',
    password: '123456',
  },
};
```

### Sample usage
```js
const { getObjectBySchema } = require('vanilla-object-parser');
const output = getObjectBySchema(obj, userSchema);

console.log(output);
```