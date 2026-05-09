# AntiEm

> Protect your text from the tyranny of em dashes.

Em dashes are **out of control**. They sneak into your writing — uninvited — and wreak havoc on readability. AntiEm is the solution.

## Installation

```bash
npm install -g antiem
```

## Usage

```bash
# Purge em dashes from a file (output to stdout)
antiem document.txt

# Fix a file in place
antiem --fix document.txt

# Scan for threats
antiem --scan document.txt

# Nuclear option: also remove en dashes
antiem --aggressive --fix document.txt

# Pipe from stdin
echo "hello—world" | antiem -
```

## Threat Levels

| Level      | Meaning                                    |
| ---------- | ------------------------------------------ |
| ALL CLEAR  | No em dashes detected. You're safe.        |
| GUARDED    | Minor em dash presence. Stay vigilant.     |
| ELEVATED   | Multiple em dashes. Action recommended.    |
| SEVERE     | High em dash density. Immediate action.    |
| CRITICAL   | Text is saturated with em dashes. Code red.|

## API

```js
const { purge, detect, stats } = require("antiem");

purge("hello—world");
// => "hello - world"

detect("hello—world");
// => [{ index: 5, char: "—", type: "em-dash" }]

stats("hello—world—foo");
// => { emDashes: 2, enDashes: 0, doubleHyphens: 0, total: 2, threatLevel: "GUARDED" }
```

## Why?

Because every em dash is a cry for help from a hyphen that got stretched too thin.

## License

MIT
