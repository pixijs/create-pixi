# PixiJS Extension Boilerplate

This is a simple boilerplate project powered by [PixiJS Extension Scripts](https://github.com/pixijs/extension-scripts). It demonstrates how you can create an extension for PixiJS that works with TypeScript, generates all the necessary build files and supports documentation (with webdoc) and unit-testing (with Jest).

## Getting Started

This project assumes you are familiar with `npm`, `node.js` and **package.json** files.

```bash
npm install
npm run dev
```

`npm run dev` rebuilds the extension when files in `./src` change and opens `./examples` at http://localhost:8080/examples. The server caches files for an hour, so hard-reload the page (or disable the cache in your browser's developer tools) to pick up a rebuild.

PixiJS Extension Scripts expects a flat `node_modules`. With pnpm, add `node-linker=hoisted` to `.npmrc` and run `pnpm approve-builds` to allow Electron, which the tests run in.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Watch `./src` and serve `./examples` |
| `npm run build` | Lint, type-check and bundle into `./dist` and `./lib` |
| `npm test` | Run the Jest unit-tests in Electron |
| `npm run lint` | Lint `./src` and `./examples` with ESLint |
| `npm run format` | Fix lint and formatting issues |
| `npm run docs` | Generate API documentation into `./docs` |
| `npm run release` | Bump the version, test, build, publish to npm and deploy to GitHub Pages |

## Structure

| Path | Description |
|---|---|
| `./src` | Folder containing the source code for your extension |
| `./src/__tests__` | Folder containing the Jest-based unit-tests (i.e., `*.test.ts`) |
| `./examples` | Folder containing any examples to demonstrate usage |
| `./jest.config.mjs` | Jest configuration used by `npm test` |

## Publishing

When you're ready to publish your extension and share with the world, run the following command.
This will ask you which type of version bump you'd like to do and then do all the necessary steps to build
and package your extension.

```bash
npm run release
```

Releasing pushes to your git remote and deploys `./dist`, `./examples` and `./docs` to a `gh-pages` branch, so set up a GitHub repository and run `npm login` first.
