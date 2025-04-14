# PixiJS Create

<div align="center">
<img src=".github/logo.svg" alt="Logo"/>
<h3>A CLI tool to scaffold PixiJS projects</h3>
</div>

## Scaffolding Your First PixiJS Project

Check out the full documentation at [pixijs.io/create-pixi](https://pixijs.io/create-pixi/).

> **Compatibility Note:**
> PixiJS requires [Node.js](https://nodejs.org/en/) version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

With NPM:

```bash
$ npm create pixi.js@latest
```

With Yarn:

```bash
$ yarn create pixi.js
```

With PNPM:

```bash
$ pnpm create pixi.js
```

With Bun:

```bash
$ bun create pixi.js
```

Then follow the prompts!

### Advanced Usage

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a PixiJS + Vite project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create pixi.js@latest pixi-project -- --template bundler-vite

# yarn
yarn create pixi.js pixi-project --template bundler-vite

# pnpm
pnpm create pixi.js pixi-project --template bundler-vite

# Bun
bun create pixi.js pixi-project --template bundler-vite
```

Currently supported template presets include:

- `bundler-vite`
- `bundler-vite-js`
- `bundler-webpack`
- `bundler-webpack-js`
- `bundler-esbuild`
- `bundler-esbuild-js`
- `bundler-import-map`
- `bundler-import-map-js`
- `creation-web`
- `framework-react`
- `extension-default`

You can use `.` for the project name to scaffold in the current directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

This project is based on amazing [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) tool and inspired by the [create-game](https://github.com/phaserjs/create-game) project by [Phaser](https://phaser.io/).
We are grateful for their work and the inspiration it provided.
