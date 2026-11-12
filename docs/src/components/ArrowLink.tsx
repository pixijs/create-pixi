import Link from "@docusaurus/Link";
import clsx from "clsx";

import styles from "./ArrowLink.module.css";

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      className={clsx(styles.icon, className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** An ink link with a trailing arrow, which never wraps onto a line of its own */
export default function ArrowLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: string;
}) {
  const lastWord = children.lastIndexOf(" ") + 1;

  return (
    <Link to={to} className={clsx(styles.link, className)}>
      {children.slice(0, lastWord)}
      <span className={styles.lastWord}>
        {children.slice(lastWord)}
        <ArrowIcon className={styles.arrow} />
      </span>
    </Link>
  );
}
