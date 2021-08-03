Example of how this works:
```ts
const yourArray = ['a', 'b', 'c'];
const last = yourArray[-1];
const secondLast = yourArray[-2];
```

To install, put this in your tsconfig.json of your roblox-ts project under compiler options:
```json
"plugins": [
    {
        "transform": "rbxts-negative-index"
    }
],
```
