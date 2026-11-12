import useBrokenLinks from "@docusaurus/useBrokenLinks";
import ArrowLink from "@site/src/components/ArrowLink";
import Button from "@site/src/components/Button";
import CommandLine from "@site/src/components/CommandLine";
import HeroStage from "@site/src/components/HeroStage";
import PackageManagerSwitch from "@site/src/components/PackageManagerSwitch";
import TemplateGallery from "@site/src/components/TemplateGallery";
import {
  createCommand,
  installCommand,
  runCommand,
  usePackageManager,
} from "@site/src/data/commands";
import { majorVersion } from "@site/src/data/templates";
import Layout from "@theme/Layout";
import clsx from "clsx";

import styles from "./index.module.css";

export default function Home() {
  const [pm] = usePackageManager();

  useBrokenLinks().collectAnchor("templates");

  return (
    <Layout
      title="Scaffold a PixiJS project"
      description="Create a PixiJS game or app with Vite, webpack, esbuild or React in one command."
    >
      <main className={styles.home}>
        <header className={styles.hero}>
          <div className={clsx("container", styles.heroGrid)}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>
                Create a PixiJS app with one command
              </h1>
              <p className={styles.lead}>
                Answer a few prompts and get a working PixiJS{" "}
                {majorVersion("pixi.js")} project with PixiJS 3D, a dev server,
                linting and formatting already set up.
              </p>
              <div className={styles.install}>
                <div className={clsx(styles.terminal, "px-on-dark")}>
                  <div className={styles.terminalBar}>
                    <PackageManagerSwitch bar />
                  </div>
                  <CommandLine
                    variant="hero"
                    base={createCommand(pm)}
                    copyLabel={`Copy the ${pm} create command`}
                  />
                </div>
                <p className={styles.note}>
                  Needs Node.js 22.12 or newer.
                  <br />
                  Then run <code>{installCommand(pm)}</code> and{" "}
                  <code>{runCommand(pm, "dev")}</code> in the new&nbsp;folder.
                </p>
              </div>
              <Button className={styles.cta} to="/docs/guide/installation">
                Getting started
              </Button>
            </div>
            <HeroStage className={styles.stage} />
          </div>
        </header>

        <section
          id="templates"
          className={clsx(styles.section, styles.band)}
          aria-labelledby="templates-title"
        >
          <div className="container">
            <div className={clsx(styles.sectionHead, styles.splitHead)}>
              <div>
                <h2 id="templates-title" className={styles.sectionTitle}>
                  Pick a template
                </h2>
                <p className={styles.sectionLead}>
                  These commands skip the prompts. Replace <code>my-app</code>{" "}
                  with your folder name, or use <code>.</code> for the current
                  folder.
                </p>
              </div>
              <PackageManagerSwitch />
            </div>
            <TemplateGallery pm={pm} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="features-title">
          <div className={clsx("container", styles.split)}>
            <div className={styles.splitStart}>
              <h2 id="features-title" className={styles.sectionTitle}>
                In every project
              </h2>
              <ArrowLink
                className={styles.more}
                to="/docs/guide/choosing-a-template#what-every-app-template-includes"
              >
                What every template includes
              </ArrowLink>
            </div>
            <ul className={styles.facts}>
              <li>
                <h3>Dev server on port 8080</h3>
                <p>
                  Start it with <code>{runCommand(pm, "dev")}</code>. Most
                  templates open it in your browser too.
                </p>
              </li>
              <li>
                <h3>Production build</h3>
                <p>
                  <code>{runCommand(pm, "build")}</code> lints your code,
                  type-checks TypeScript, and writes the app to{" "}
                  <code>dist/</code>.
                </p>
              </li>
              <li>
                <h3>oxlint and oxfmt</h3>
                <p>
                  <code>lint</code> and <code>format</code> scripts, plus
                  VS&nbsp;Code settings that lint and format on save.
                </p>
              </li>
              <li>
                <h3>TypeScript or JavaScript</h3>
                <p>
                  Most templates come in both. The JavaScript versions are the
                  same code with the types removed.
                </p>
              </li>
            </ul>
            <p className={clsx(styles.small, styles.footnote)}>
              The extension template uses PixiJS Extension Scripts for these
              instead, and the import map template has no build step.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
