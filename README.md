# tstl-const-propagation

[![CI](https://github.com/thinknathan/tstl-const-propagation/actions/workflows/ci.yml/badge.svg)](https://github.com/thinknathan/tstl-const-propagation/actions/workflows/ci.yml)

TypeScriptToLua plugin that performs [constant propagation](https://en.wikipedia.org/wiki/Constant_folding#Constant_propagation).

As of v2.0.0, [constant folding](https://en.wikipedia.org/wiki/Constant_folding) is also performed.

The variable label must be written in SNAKE_CASE to be eligible.

## Limitations

- Only applies to local variables that are declared in a single statement on their own line: multi-line declarations and variables that are declared and written in separate statements are not eligible
- Only operates on one file at a time: cannot copy variables between separate files
- Only applies to values that are string literals or numeric literals
- Only intended for use with actual constants (values that do not change at runtime)

Redundancy warning: Your target Lua runtime may already perform constant propagation and constant folding.

:exclamation: Use this and any code transformation plugin with caution. Mistakes are possible.

## Example

```ts
const FOO = 60;
bar(FOO);
const result = FOO + 40;
```

Becomes:

```lua
bar(60)
local result = 100
```

## Installation

Requires TSTL >= 1.22.0

1. Install this plugin

```bash
yarn add git+https://git@github.com/thinknathan/tstl-const-propagation.git#^2.0.0 -D
# or
npm install git+https://git@github.com/thinknathan/tstl-const-propagation.git#^2.0.0 --save-dev
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
