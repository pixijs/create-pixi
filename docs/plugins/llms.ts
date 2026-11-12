import fs from "node:fs/promises";
import path from "node:path";

import type { LoadedContent } from "@docusaurus/plugin-content-docs";
import type { LoadContext, Plugin } from "@docusaurus/types";
import { load } from "cheerio";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

interface Page {
  title: string;
  description?: string;
  /** Path under the site's base URL, without a trailing slash, such as `docs/guide/cli` */
  path: string;
  /** The sidebar section the page is listed under */
  section: string;
}

type SidebarItem =
  LoadedContent["loadedVersions"][number]["sidebars"][string][number];

/**
 * Publishes the docs for LLMs, following https://llmstxt.org: a Markdown copy
 * of each page beside its HTML (`/docs/guide/cli.md`), `llms.txt` listing them
 * in sidebar order, and `llms-full.txt` with every page in one file. Pages are
 * converted from the built HTML, so components and imported template files
 * come through as they render.
 */
export default function llmsPlugin(context: LoadContext): Plugin {
  const { siteConfig } = context;
  const siteUrl = `${siteConfig.url}${siteConfig.baseUrl}`;
  let pages: Page[] = [];

  return {
    name: "llms-txt",

    allContentLoaded({ allContent }) {
      const docs = allContent["docusaurus-plugin-content-docs"]
        ?.default as LoadedContent;
      const version = docs.loadedVersions[0];
      const docsById = new Map(version.docs.map((doc) => [doc.id, doc]));

      pages = [];

      const add = (id: string, section: string) => {
        const doc = docsById.get(id)!;

        pages.push({
          title: doc.title,
          description: doc.description,
          path: doc.permalink
            .slice(siteConfig.baseUrl.length)
            .replace(/\/$/, ""),
          section,
        });
      };

      const addAll = (items: SidebarItem[], section: string) => {
        for (const item of items) {
          if (item.type === "doc") add(item.id, section);
          if (item.type === "category") {
            if (item.link?.type === "doc") add(item.link.id, section);
            addAll(item.items, section);
          }
        }
      };

      // Top-level categories become sections, and pages outside one go first
      for (const item of Object.values(version.sidebars).flat()) {
        if (item.type === "category") {
          if (item.link?.type === "doc") add(item.link.id, item.label);
          addAll(item.items, item.label);
        } else {
          addAll([item], "Guide");
        }
      }
    },

    async postBuild({ outDir }) {
      const markdownUrls = new Map(
        pages.map((page) => [
          `${siteConfig.baseUrl}${page.path}/`,
          `${siteUrl}${page.path}.md`,
        ]),
      );
      const documents: string[] = [];

      for (const page of pages) {
        const htmlFile = path.join(outDir, page.path, "index.html");
        const markdownUrl = `${siteUrl}${page.path}.md`;
        const html = await fs.readFile(htmlFile, "utf8");
        const markdown = await toMarkdown(html, (href) => {
          const [pathname, hash] = href.split("#");
          const target = markdownUrls.get(pathname);

          if (!target) return `${siteConfig.url}${href}`;

          return hash ? `${target}#${hash}` : target;
        });

        documents.push(markdown);
        await fs.writeFile(path.join(outDir, `${page.path}.md`), markdown);
        await fs.writeFile(
          htmlFile,
          html.replace(
            "</head>",
            `<link rel="alternate" type="text/markdown" href="${markdownUrl}"></head>`,
          ),
        );
      }

      const sections = new Map<string, Page[]>();

      for (const page of pages) {
        sections.set(page.section, [
          ...(sections.get(page.section) ?? []),
          page,
        ]);
      }

      const index = [
        `# ${siteConfig.title}`,
        `> ${siteConfig.tagline}. Run \`npm create pixi.js@latest\`, answer the prompts, and get a working PixiJS project.`,
        "Each link is the Markdown version of a docs page. Add `.md` to any docs URL to get its Markdown.",
        ...[...sections].map(
          ([section, items]) =>
            `## ${section}\n\n${items
              .map(
                (page) =>
                  `- [${page.title}](${siteUrl}${page.path}.md)${page.description ? `: ${page.description}` : ""}`,
              )
              .join("\n")}`,
        ),
        `## Optional\n\n- [Every page in one file](${siteUrl}llms-full.txt)`,
      ];

      await fs.writeFile(
        path.join(outDir, "llms.txt"),
        `${index.join("\n\n")}\n`,
      );
      await fs.writeFile(
        path.join(outDir, "llms-full.txt"),
        `${documents.join("\n---\n\n")}`,
      );
    },
  };
}

/** The docs content of a built page as Markdown, with links made absolute by `resolveLink` */
async function toMarkdown(html: string, resolveLink: (href: string) => string) {
  const $ = load(html);
  const article = $(".theme-doc-markdown").first();

  article.find(".hash-link, .theme-doc-toc-mobile, button").remove();

  // A plain <pre> with the language and title, which the `pre` handler below reads
  article.find(".theme-code-block").each((_, element) => {
    const block = $(element);
    const code = block
      .find(".token-line")
      .map((_, line) => $(line).text())
      .get()
      .join("\n");

    block.replaceWith(
      $("<pre>")
        .attr(
          "data-lang",
          /language-(\S+)/.exec(block.attr("class") ?? "")?.[1],
        )
        .attr("data-title", block.find('[class*="codeBlockTitle"]').text())
        .text(code),
    );
  });

  // Every tab, each under its label
  article.find(".tabs-container").each((_, element) => {
    const tabs = $(element);
    const labels = tabs.find('[role="tab"]');

    tabs.replaceWith(
      tabs
        .find('[role="tabpanel"]')
        .map((index, panel) => {
          const label = $("<strong>").text(labels.eq(index).text());

          return `<p>${$.html(label)}</p>${$(panel).html()}`;
        })
        .get()
        .join(""),
    );
  });

  article.find(".theme-admonition").each((_, element) => {
    const admonition = $(element);
    const title = $("<strong>").text(admonition.children().first().text());

    admonition.replaceWith(
      `<blockquote><p>${$.html(title)}</p>${admonition.children().last().html()}</blockquote>`,
    );
  });

  article.find("a[href^='/']").each((_, element) => {
    const link = $(element);

    link.attr("href", resolveLink(link.attr("href")!));
  });

  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark, {
      handlers: {
        pre(state, node) {
          const { dataLang, dataTitle } = node.properties;
          const result = {
            type: "code" as const,
            lang: dataLang ? String(dataLang) : null,
            meta: dataTitle ? `title="${dataTitle}"` : null,
            value: node.children
              .map((child) => (child.type === "text" ? child.value : ""))
              .join(""),
          };

          state.patch(node, result);

          return result;
        },
      },
    })
    .use(remarkGfm)
    .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-" })
    // React separates adjacent text with <!-- --> comments
    .process((article.html() ?? "").replace(/<!--[\s\S]*?-->/g, ""));

  return String(file);
}
