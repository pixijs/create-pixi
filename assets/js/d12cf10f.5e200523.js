"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[990],{2368:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"guide/installation","title":"Installation","description":"PixiJS requires Node.js version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.","source":"@site/docs/guide/installation.mdx","sourceDirName":"guide","slug":"/guide/installation","permalink":"/create-pixi/docs/guide/installation","draft":false,"unlisted":false,"editUrl":"https://github.com/pixijs/create-pixi/tree/main/packages/docs/docs/guide/installation.mdx","tags":[],"version":"current","sidebarPosition":0,"frontMatter":{"sidebar_position":0,"title":"Installation"},"sidebar":"guide","next":{"title":"Introduction","permalink":"/create-pixi/docs/guide/games/intro"}}');var s=i(2540),r=i(3023);const a={sidebar_position:0,title:"Installation"},l=void 0,o={},c=[{value:"Templates",id:"templates",level:3},{value:"Games",id:"games",level:3},{value:"License",id:"license",level:2},{value:"Acknowledgements",id:"acknowledgements",level:2}];function d(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h2:"h2",h3:"h3",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.admonition,{type:"info",children:[(0,s.jsx)(n.mdxAdmonitionTitle,{children:(0,s.jsx)(n.strong,{children:"Compatibility Note"})}),(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["PixiJS requires ",(0,s.jsx)(n.a,{href:"https://nodejs.org/en/",children:"Node.js"})," version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it."]}),"\n"]})]}),"\n",(0,s.jsx)(n.p,{children:"With NPM:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm create pixi.js@latest\n"})}),"\n",(0,s.jsx)(n.p,{children:"With Yarn:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"With PNPM:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"pnpm create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"With Bun:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"bun create pixi.js\n"})}),"\n",(0,s.jsx)(n.p,{children:"Then follow the prompts!"}),"\n",(0,s.jsx)(n.p,{children:"You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a PixiJS + Vite project, run:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# npm 7+, extra double-dash is needed:\nnpm create pixi.js@latest pixi-project -- --template bundler-vite\n\n# yarn\nyarn create pixi.js pixi-project --template bundler-vite\n\n# pnpm\npnpm create pixi.js pixi-project --template bundler-vite\n\n# Bun\nbun create pixi.js pixi-project --template bundler-vite\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You can use ",(0,s.jsx)(n.code,{children:"."})," for the project name to scaffold in the current directory."]}),"\n",(0,s.jsx)(n.h3,{id:"templates",children:"Templates"}),"\n",(0,s.jsx)(n.p,{children:"Currently supported template presets include:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-vite"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-webpack"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-esbuild"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"bundler-import-map"})}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"games",children:"Games"}),"\n",(0,s.jsx)(n.p,{children:"We also have some additional templates that you can use for creating games for specific platforms:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"game-web"})}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Coming soon:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"game-discord"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"game-facebook"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"game-youtube"})}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"These templates include additional configurations and dependencies to help you get started with your game development. As such they are more opinionated than the general bundler templates."}),"\n",(0,s.jsxs)(n.p,{children:["Find out more about the templates in the ",(0,s.jsx)(n.a,{href:"/docs/guide/games/intro",children:"Games"})," section."]}),"\n",(0,s.jsx)(n.h2,{id:"license",children:"License"}),"\n",(0,s.jsx)(n.p,{children:"This project is licensed under the MIT License"}),"\n",(0,s.jsx)(n.h2,{id:"acknowledgements",children:"Acknowledgements"}),"\n",(0,s.jsxs)(n.p,{children:["This project is based on ",(0,s.jsx)(n.a,{href:"https://github.com/vitejs/vite/tree/main/packages/create-vite",children:"create-vite"}),"."]})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},3023:(e,n,i)=>{i.d(n,{R:()=>a,x:()=>l});var t=i(3696);const s={},r=t.createContext(s);function a(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);