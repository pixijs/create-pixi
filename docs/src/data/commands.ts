import { useStorageSlot } from "@docusaurus/theme-common";

export const packageManagers = ["npm", "yarn", "pnpm", "bun"] as const;

export type PackageManager = (typeof packageManagers)[number];

export interface CreateOptions {
  /** Target directory, `.` for the current one */
  dir?: string;
  /** Template id passed to `--template` */
  template?: string;
}

/** The create command and directory, and the template flags apart, so a layout can put them on their own line */
export function createCommandParts(
  pm: PackageManager,
  { dir, template }: CreateOptions = {},
) {
  const create =
    pm === "npm" ? "npm create pixi.js@latest" : `${pm} create pixi.js`;
  const base = dir ? `${create} ${dir}` : create;
  // npm only forwards options that come after `--` to the create package
  const flags = template
    ? `${pm === "npm" ? "-- " : ""}--template ${template}`
    : undefined;

  return { base, flags };
}

/** The create command for a package manager, matching the root README */
export function createCommand(pm: PackageManager, options?: CreateOptions) {
  const { base, flags } = createCommandParts(pm, options);

  return [base, flags].filter(Boolean).join(" ");
}

// The same commands the CLI prints when it finishes
export { installCommand, runCommand } from "../../../src/commands";

/** Shares the choice with every `<Tabs groupId="package-manager">` on the site */
const storageKey = "docusaurus.tab.package-manager";

export function usePackageManager() {
  const [stored, slot] = useStorageSlot(storageKey);
  const current = packageManagers.find((pm) => pm === stored) ?? "npm";
  const select = (pm: PackageManager) => slot.set(pm);

  return [current, select] as const;
}
