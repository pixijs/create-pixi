import { packageManagers, usePackageManager } from "@site/src/data/commands";

import Segmented from "./Segmented";

const options = packageManagers.map((pm) => ({ value: pm, label: pm }));

export default function PackageManagerSwitch({ bar }: { bar?: boolean }) {
  const [pm, setPm] = usePackageManager();

  return (
    <Segmented
      legend="Package manager"
      options={options}
      value={pm}
      onChange={setPm}
      bar={bar}
    />
  );
}
