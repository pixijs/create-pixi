/** The command that installs a project's dependencies */
export function installCommand(pm: string) {
  return pm === "yarn" ? "yarn" : `${pm} install`;
}

/** The command that runs one of a project's scripts */
export function runCommand(pm: string, script: string) {
  return pm === "yarn" ? `yarn ${script}` : `${pm} run ${script}`;
}
