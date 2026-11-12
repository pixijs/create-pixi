# create-pixi.js docs

The documentation site for create-pixi.js, built with [Docusaurus](https://docusaurus.io/) and published at [pixijs.io/create-pixi](https://pixijs.io/create-pixi/).

## Install

The site is an npm workspace of the repository, so install from the repository root:

```bash
npm install
```

## Develop

```bash
npm start --workspace docs
```

This starts a dev server at http://localhost:3000/create-pixi/ and reloads when you edit a page.

## Check

```bash
npm run typecheck --workspace docs
npm run build --workspace docs
```

The build fails on broken links and anchors. To preview the built site:

```bash
npm run serve --workspace docs
```

## Deploy

Pushing to `main` deploys the site through `.github/workflows/deploy-docs.yaml`. To deploy by hand to the `gh-pages` branch:

```bash
GIT_USER=<your GitHub username> npm run deploy --workspace docs
```

## Template data

Template names, ids, descriptions, categories and languages come from `templates/manifest.ts` in the repository root, and dependency versions from `templates/package.json`. The `@templates` alias in `docusaurus.config.ts` and `tsconfig.json` points at that folder. Add or change a template there, not in the docs.
