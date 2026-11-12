# Linting and formatting

Every app template comes with [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) for formatting. Both come from the [Oxc](https://oxc.rs) project and are written in Rust, so they check a whole template in well under a second. A new project passes both with no changes.

The [extension template](https://pixijs.io/create-pixi/docs/guide/extension.md) is the exception. It lints with ESLint through `xs lint`.

## Scripts

Lint the project:

**npm**

```bash
npm run lint
```

**yarn**

```bash
yarn lint
```

**pnpm**

```bash
pnpm run lint
```

**bun**

```bash
bun run lint
```

Format every file in place:

**npm**

```bash
npm run format
```

**yarn**

```bash
yarn format
```

**pnpm**

```bash
pnpm run format
```

**bun**

```bash
bun run format
```

`build` runs oxlint first, so a lint error stops the build. Warnings don't.

Two useful variations, shown with npm:

```bash
npm run lint -- --fix   # fix what oxlint can fix on its own
npx oxfmt --check       # list unformatted files without changing them, for CI
```

## Config files

`.oxlintrc.json` turns on the plugins and rules:

```json title=".oxlintrc.json"
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "unicorn", "oxc", "import"],
  "env": {
    "browser": true,
    "es2024": true
  },
  "categories": {
    "correctness": "error"
  },
  "rules": {
    "import/no-duplicates": "error",
    "typescript/consistent-type-imports": "error"
  },
  "ignorePatterns": ["dist"]
}
```

- The `correctness` category reports code that is almost certainly a bug, such as unreachable code or a comparison that is always false.
- `import/no-duplicates` flags two import statements for the same module.
- `typescript/consistent-type-imports` asks for `import type` when an import is only used as a type, so bundlers can drop it.

The React template adds the `react` plugin with the `rules-of-hooks`, `exhaustive-deps` and `only-export-components` rules.

For more checks, add a category such as `"suspicious": "warn"` or `"perf": "warn"`, or set single rules under `rules`. The [oxlint rules list](https://oxc.rs/docs/guide/usage/linter/rules) shows every rule and its category.

`.oxfmtrc.json` sets the formatter options:

```json title=".oxfmtrc.json"
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
  "sortImports": true
}
```

oxfmt formats code the way Prettier does and accepts Prettier's common options, such as `semi`, `singleQuote` and `tabWidth`. `sortImports` sorts and groups import statements.

The `$schema` lines give you autocompletion in editors that read JSON schemas.

## VS Code

`.vscode/extensions.json` recommends the [Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode), `oxc.oxc-vscode`. VS Code offers to install it when you open the project. It shows lint problems as you type.

`.vscode/settings.json` makes the extension the formatter for the project's file types, and formats and applies safe lint fixes when you save:

```json title=".vscode/settings.json"
{
  "[css][html][javascript][javascriptreact][json][jsonc][markdown][typescript][typescriptreact]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

The formatter is set per language so it also wins over language-specific formatters in your user settings, such as Prettier for `[json]`.

The template's `.gitignore` ignores everything in `.vscode/` except these two files.

## Other editors

oxlint and oxfmt work in any editor with language server support, and there are plugins for editors such as Zed and the JetBrains IDEs. See the [Oxc editor setup guide](https://oxc.rs/docs/guide/usage/linter/editors).

## Using ESLint or Prettier instead

The templates run oxlint in `lint` and at the start of `build`, and oxfmt in `format`. To switch, uninstall both, delete their configs and change those scripts.
