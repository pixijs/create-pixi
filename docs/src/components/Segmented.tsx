import clsx from "clsx";
import { useId } from "react";

import styles from "./Command.module.css";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  /** Accessible name of the group */
  legend: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Drops the track, for a control that sits in a title bar */
  bar?: boolean;
}

/** A row of native radio buttons styled as a segmented control */
export default function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  bar,
}: Props<T>) {
  const name = useId();

  return (
    <fieldset className={clsx(styles.segmented, bar && styles.bar)}>
      <legend className={styles.visuallyHidden}>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
