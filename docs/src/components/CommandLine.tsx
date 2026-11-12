import clsx from "clsx";
import { Fragment } from "react";

import CopyButton from "./CopyButton";

import styles from "./Command.module.css";

interface Props {
  /** The create command and its directory */
  base: string;
  /** `--template <id>`, if any */
  flags?: string;
  /** Accessible name of the copy button */
  copyLabel: string;
  /** `hero` for the terminal at the top of the homepage, `row` for a template's command in its own box */
  variant: "hero" | "row";
}

/** Breaks between words, never inside one, with wrapped lines starting under the command rather than the prompt */
export default function CommandLine({
  base,
  flags,
  copyLabel,
  variant,
}: Props) {
  const idStart = flags ? flags.lastIndexOf(" ") : -1;

  return (
    <div className={clsx(styles.command, styles[variant])}>
      <code className={styles.commandText}>
        <span className={styles.prompt} aria-hidden="true">
          $
        </span>
        {base.split(" ").map((word, index) => (
          <Fragment key={index}>
            {index > 0 && " "}
            <span className={styles.word}>{word}</span>
          </Fragment>
        ))}
        {flags && (
          <>
            {" "}
            <span className={styles.word}>{flags.slice(0, idStart)}</span>{" "}
            <span className={styles.id}>{flags.slice(idStart + 1)}</span>
          </>
        )}
      </code>
      <CopyButton text={flags ? `${base} ${flags}` : base} label={copyLabel} />
    </div>
  );
}
