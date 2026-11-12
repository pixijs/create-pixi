# PixiJS Create

<div align="center">
<img src=".github/logo.svg" alt="Logo"/>
<h3>A CLI tool to scaffold PixiJS projects</h3>
</div>

## Scaffolding your first PixiJS project

Check out the full documentation at [pixijs.io/create-pixi](https://pixijs.io/create-pixi/).

> **Compatibility Note:**
> The templates need [Node.js](https://nodejs.org/en/) 22.12 or newer (22.15 or newer for the webpack template). We recommend the current LTS release.

```bash
# npm
npm create pixi.js@latest

# yarn
yarn create pixi.js

# pnpm
pnpm create pixi.js

# bun
bun create pixi.js
```

Then follow the prompts!

### Choosing a template up front

Pass a project name and `--template` to skip the prompts. For example, to scaffold a PixiJS + Vite project:

```bash
# npm needs the extra double-dash
npm create pixi.js@latest my-app -- --template bundler-vite

yarn create pixi.js my-app --template bundler-vite
pnpm create pixi.js my-app --template bundler-vite
bun create pixi.js my-app --template bundler-vite
```

Use `.` as the project name to scaffold into the current directory. Run with `--help` to list every template.

| Template                            | TypeScript                    | JavaScript                       |
| ----------------------------------- | ----------------------------- | -------------------------------- |
| Web game                            | `starter-web`                 | `starter-web-js`                 |
| Web multiplayer game (Colyseus)     | `starter-web-multiplayer`     | `starter-web-multiplayer-js`     |
| Discord Activity                    | `starter-discord`             | `starter-discord-js`             |
| Discord Activity multiplayer        | `starter-discord-multiplayer` | `starter-discord-multiplayer-js` |
| Vite (recommended)                  | `bundler-vite`                | `bundler-vite-js`                |
| webpack                             | `bundler-webpack`             | `bundler-webpack-js`             |
| esbuild                             | `bundler-esbuild`             | `bundler-esbuild-js`             |
| Import map (no build step)          | n/a                           | `bundler-import-map`             |
| React                               | `framework-react`             | `framework-react-js`             |
| Extension (publish a PixiJS plugin) | `extension-default`           | n/a                              |

The game templates are starters built with Vite, with [GSAP](https://gsap.com/), [PixiJS UI](https://github.com/pixijs/ui), [PixiJS Sound](https://github.com/pixijs/sound), [PixiJS Filters](https://github.com/pixijs/filters) and [Spine](https://esotericsoftware.com/spine-pixi) ready to use. The multiplayer versions add a [Colyseus](https://colyseus.io/) server.

Every app template comes with [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) set up. Each one also includes [PixiJS 3D](https://github.com/pixijs/3d) and draws a spinning 3D cube with it. The extension template lists PixiJS 3D as a peer dependency.

## Contributing

```bash
npm install
npm run build        # build the CLI and generate every template into dist/templates
npm test
npm run play -- bundler-vite   # live preview a template while editing it
```

Templates are assembled from shared layers. See [templates/README.md](templates/README.md) for how that works and how to add or update a template.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

This project is based on amazing [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) tool and inspired by the [create-game](https://github.com/phaserjs/create-game) project by [Phaser](https://phaser.io/).
We are grateful for their work and the inspiration it provided.
