# tstl-const-propagation

TypeScriptToLua plugin that performs [constant propagation](https://en.wikipedia.org/wiki/Constant_folding#Constant_propagation).

- Only applies to local variables that are declared in a single statement on their own line
- Only applies to values that are string literals or numeric literals
- Only intended for use with actual constants (values that do not change at runtime)
  - Local variable label must be written in SNAKE_CASE

Redundancy warning: Your target Lua runtime may already perform constant propagation.

## Example

```ts
const FOO = 60;
bar(FOO);
const result = FOO + 40;
```

Becomes:

```lua
bar(60)
local result = 60 + 40
```

## Installation

1. Install this plugin

```bash
yarn add git+https://git@github.com/thinknathan/tstl-const-propagation.git#^1.0.0 -D
# or
npm install git+https://git@github.com/thinknathan/tstl-const-propagation.git#^1.0.0 --save-dev
```

2. Add `tstl-const-propagation` to `tstl.luaPlugins` in `tsconfig.json`

```diff
{
	"tstl": {
		"luaPlugins": [
+			{ "name": "tstl-const-propagation" }
		],
	}
}
```

## License

CC0
