import clsx from "clsx";
import { useEffect, useState } from "react";

import styles from "./Command.module.css";

interface Props {
  text: string;
  /** Accessible name, e.g. "Copy the npm create command" */
  label: string;
}

/** Two sheets, or a tick once copied */
export function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.copyIcon}>
      {copied ? (
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      ) : (
        <>
          <rect x="8" y="8" width="12" height="12" rx="2.5" />
          <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" />
        </>
      )}
    </svg>
  );
}

export default function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = () =>
    navigator.clipboard.writeText(text).then(() => setCopied(true));

  return (
    <button
      type="button"
      className={clsx(styles.copy, copied && styles.copied)}
      onClick={copy}
      aria-label={label}
    >
      <CopyIcon copied={copied} />
      <span className={styles.copyText} aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
