"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[990],{2368:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"guide/installation","title":"Getting Started","description":"PixiJS requires Node.js version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.","source":"@site/docs/guide/installation.mdx","sourceDirName":"guide","slug":"/guide/installation","permalink":"/create-pixi/docs/guide/installation","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/create-pixi/tree/main/packages/docs/docs/guide/installation.mdx","tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"sidebar_position":0,"title":"Getting Started"},"sidebar":"guide","next":{"title":"Getting Started","permalink":"/create-pixi/docs/guide/creations/intro"}}');var s=i(2540),r=i(3023);const a={sidebar_position:0,title:"Getting Started"},l=void 0,o={},d=[{value:"Bundler Templates",id:"bundler-templates",level:2},{value:"Creation Templates (Recommended)",id:"creation-templates-recommended",level:2},{value:"Extension Templates",id:"extension-templates",level:2},{value:"Advanced Usage",id:"advanced-usage",level:2},{value:"Template List",id:"template-list",level:3},{value:"License",id:"license",level:2},{value:"Acknowledgements",id:"acknowledgements",level:2}];function c(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsx)(n.mdxAdmonitionTitle,{children:(0,s.jsx)(n.strong,{children:"Compatibility Note"})}),(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["PixiJS requires ",(0,s.jsx)(n.a,{href:"https://nodejs.org/en/",children:"Node.js"})," version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it."]}),"\n"]})]}),"\n",(0,s.jsx)(n.p,{children:"With NPM:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm create pixi.js@latest\n"})}),"\n",(0,s.jsx)(n.p,{children:"With Yarn:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"With PNPM:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"pnpm create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"With Bun:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"bun create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"Then follow the prompts!"}),"\n",(0,s.jsx)(n.h2,{id:"bundler-templates",children:"Bundler Templates"}),"\n",(0,s.jsx)(n.p,{children:"Bundler templates are general templates that you can use to scaffold a PixiJS project with a specific bundler.\nThey include the necessary configurations and dependencies to get you started however they are not particularly opinionated about the project structure."}),"\n",(0,s.jsx)(n.p,{children:"Currently supported template presets include:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://vite.dev",children:"Vite"})})," + PixiJS (Recommended)"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://webpack.js.org/",children:"Webpack"})})," + PixiJS"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://esbuild.github.io/",children:"esbuild"})})," + PixiJS"]}),"\n",(0,s.jsxs)(n.li,{children:["PixiJS imported via ",(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap",children:"import maps"})})]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"creation-templates-recommended",children:"Creation Templates (Recommended)"}),"\n",(0,s.jsx)(n.p,{children:"We have created some additional templates that you can use for creating projects for specific platforms.\nThese templates include additional configurations and dependencies to help you get started with your app development.\nAs such they are more opinionated than the general bundler templates."}),"\n",(0,s.jsx)(n.p,{children:"The goal of these templates is to provide a more tailored experience for developers who are less experienced with setting up a PixiJS project from scratch."}),"\n",(0,s.jsxs)(n.p,{children:["Find out more about these templates in the ",(0,s.jsx)(n.a,{href:"/docs/guide/creations/intro",children:"Creation Template"})," section."]}),"\n",(0,s.jsx)(n.p,{children:"Currently supported creation templates include:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Web: A general template for building web-based applications."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Coming soon:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://github.com/discord/embedded-app-sdk",children:"Discord Template"})}),": Build multiplayer applications for Discord using their SDK."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://www.facebook.com/fbgaminghome/developers",children:"Facebook Template"})}),": Create apps for Facebook Instant Games."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)(n.a,{href:"https://developers.google.com/youtube/gaming/playables/reference/sdk",children:"YouTube Template"})}),": Develop YouTube Playables."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"extension-templates",children:"Extension Templates"}),"\n",(0,s.jsx)(n.p,{children:"Extension templates are designed for creating libraries and plugins that enhance PixiJS functionality, such as custom filters or plugins that introduce new features."}),"\n",(0,s.jsxs)(n.p,{children:["These templates leverage ",(0,s.jsx)(n.a,{href:"https://github.com/pixijs/extension-scripts",children:"PixiJS ExtensionScript"}),", a CLI tool that simplifies the development process for building PixiJS-compatible extensions. To get the most out of this tool, we recommend reviewing the ExtensionScript documentation."]}),"\n",(0,s.jsx)(n.p,{children:"These templates are best suited for experienced developers familiar with PixiJS and common development toolchains."}),"\n",(0,s.jsx)(n.h2,{id:"advanced-usage",children:"Advanced Usage"}),"\n",(0,s.jsx)(n.p,{children:"You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a PixiJS + Vite project, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# npm 7+, extra double-dash is needed:\nnpm create pixi.js@latest pixi-project -- --template bundler-vite\n\n# yarn\nyarn create pixi.js pixi-project --template bundler-vite\n\n# pnpm\npnpm create pixi.js pixi-project --template bundler-vite\n\n# Bun\nbun create pixi.js pixi-project --template bundler-vite\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You can use ",(0,s.jsx)(n.code,{children:"."})," for the project name to scaffold in the current directory."]}),"\n",(0,s.jsx)(n.h3,{id:"template-list",children:"Template List"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-vite"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-webpack"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-esbuild"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-import-map"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"creation-web"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"extension-default"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"license",children:"License"}),"\n",(0,s.jsx)(n.p,{children:"This project is licensed under the MIT License"}),"\n",(0,s.jsx)(n.h2,{id:"acknowledgements",children:"Acknowledgements"}),"\n",(0,s.jsxs)(n.p,{children:["This project is based on amazing ",(0,s.jsx)(n.a,{href:"https://github.com/vitejs/vite/tree/main/packages/create-vite",children:"create-vite"})," tool and inspired by the ",(0,s.jsx)(n.a,{href:"https://github.com/phaserjs/create-game",children:"create-game"})," project by ",(0,s.jsx)(n.a,{href:"https://phaser.io/",children:"Phaser"}),".\nWe are grateful for their work and the inspiration it provided."]})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},3023:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>l});var t=i(3696);const s={},r=t.createContext(s);function a(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);