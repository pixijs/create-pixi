import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { CopyIcon } from "@site/src/components/CopyButton";
import DocItemTOCDesktop from "@theme-original/DocItem/TOC/Desktop";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";

/** Copies a page's Markdown. Safari only allows the clipboard write if it gets the fetch as a promise. */
async function copyMarkdown(href: string) {
  const text = fetch(href).then((response) =>
    response.ok ? response.text() : Promise.reject(new Error(href)),
  );

  if (typeof ClipboardItem === "undefined") {
    await navigator.clipboard.writeText(await text);

    return;
  }

  const blob = text.then(
    (markdown) => new Blob([markdown], { type: "text/plain" }),
  );

  await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
}

/**
 * "On this page", with "Edit this page" and "Copy as Markdown" under it as on pixijs.com. The build writes each
 * page's Markdown next to it (plugins/llms.ts); if it can't be copied, it opens in a new tab.
 */
export default function DocItemTOCDesktopWrapper() {
  const { metadata } = useDoc();
  const [copied, setCopied] = useState(false);
  const markdown = `${metadata.permalink.replace(/\/$/, "")}.md`;

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = setTimeout(() => setCopied(false), 1800);

    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = () =>
    copyMarkdown(markdown).then(
      () => setCopied(true),
      () => window.open(markdown, "_blank", "noopener"),
    );

  return (
    <div className={styles.column}>
      <DocItemTOCDesktop />
      <div className={styles.actions}>
        {metadata.editUrl && (
          <a href={metadata.editUrl} target="_blank" rel="noopener noreferrer">
            <span className={styles.github} aria-hidden="true" />
            Edit this page
          </a>
        )}
        <button type="button" onClick={copy} aria-live="polite">
          <CopyIcon copied={copied} />
          {copied ? "Copied" : "Copy as Markdown"}
        </button>
      </div>
    </div>
  );
}
