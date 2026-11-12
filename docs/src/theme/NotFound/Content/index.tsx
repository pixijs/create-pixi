import Link from "@docusaurus/Link";
import { guideLinks } from "@site/src/data/guideLinks";
import Heading from "@theme/Heading";
import type { Props } from "@theme/NotFound/Content";
import clsx from "clsx";

export default function NotFoundContent({ className }: Props) {
  return (
    <main className={clsx("container margin-vert--xl", className)}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <Heading as="h1" className="hero__title">
            Page not found
          </Heading>
          <p>
            There's no page at this address. It may have moved when the guide
            was reorganized. Try one of these:
          </p>
          <ul>
            {guideLinks.map((page) => (
              <li key={page.to}>
                <Link to={page.to}>{page.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
