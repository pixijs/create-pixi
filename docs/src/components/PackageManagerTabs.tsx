import {
  createCommand,
  installCommand,
  packageManagers,
  runCommand,
} from "@site/src/data/commands";
import type { CreateOptions, PackageManager } from "@site/src/data/commands";
import CodeBlock from "@theme/CodeBlock";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";

function PackageManagerTabs({
  render,
}: {
  render: (pm: PackageManager) => string;
}) {
  return (
    <Tabs groupId="package-manager">
      {packageManagers.map((pm) => (
        <TabItem key={pm} value={pm} label={pm}>
          <CodeBlock language="bash">{render(pm)}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

/** `npm create pixi.js@latest` and friends, with optional directory and template */
export function CreateCommand(props: CreateOptions) {
  return <PackageManagerTabs render={(pm) => createCommand(pm, props)} />;
}

/** The commands the CLI prints once it finishes */
export function NextSteps() {
  return (
    <PackageManagerTabs
      render={(pm) =>
        ["cd my-app", installCommand(pm), runCommand(pm, "dev")].join("\n")
      }
    />
  );
}

/** One package.json script, e.g. `npm run build` */
export function RunScript({ script }: { script: string }) {
  return <PackageManagerTabs render={(pm) => runCommand(pm, script)} />;
}
