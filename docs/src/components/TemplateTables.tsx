import Link from "@docusaurus/Link";
import {
  buildToolOf,
  docsLinkOf,
  gameDocsOf,
  platformDocsOf,
  templatesByCategory,
} from "@site/src/data/templates";
import {
  categories,
  gameTemplateOf,
  games,
  labelOf,
  languageNames,
  platforms,
  templates,
  variantOf,
  variants,
} from "@templates/manifest";
import type { Language } from "@templates/manifest";

const dash = (
  <span role="img" aria-label="Not available">
    –
  </span>
);

const either = new Intl.ListFormat("en", { type: "disjunction" });
const both = new Intl.ListFormat("en");

/** Every template with its build tool and language variants */
export function TemplateComparison() {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Template</th>
            <th scope="col">What you get</th>
            <th scope="col">Build tool</th>
            <th scope="col">TypeScript</th>
            <th scope="col">JavaScript</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => {
            const buildTool = buildToolOf(template);
            const ts = variantOf(template, "ts")?.id;
            const js = variantOf(template, "js")?.id;

            return (
              <tr key={template.id}>
                <th scope="row">
                  <Link to={docsLinkOf(template)}>{template.name}</Link>
                  <small>{categories[template.category].name}</small>
                </th>
                <td>{template.description}</td>
                <td>{buildTool ?? dash}</td>
                <td>{ts ? <code>{ts}</code> : dash}</td>
                <td>{js ? <code>{js}</code> : dash}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The id of every game on every platform, single-player and multiplayer */
export function GameTemplateIds() {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Game</th>
            <th scope="col">Platform</th>
            <th scope="col">Single-player</th>
            <th scope="col">Multiplayer</th>
          </tr>
        </thead>
        <tbody>
          {games.flatMap((game) =>
            platforms.map((platform) => (
              <tr key={`${game.id}-${platform.id}`}>
                <td>
                  <Link to={gameDocsOf(game)}>{game.name}</Link>
                </td>
                <td>
                  <Link to={platformDocsOf(platform)}>{platform.name}</Link>
                </td>
                {[false, true].map((multiplayer) => {
                  const id = gameTemplateOf(game, platform, multiplayer)?.id;

                  return (
                    <td key={String(multiplayer)}>
                      {id ? <code>{id}</code> : dash}
                    </td>
                  );
                })}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Every id accepted by `--template` */
export function TemplateIds() {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <code>--template</code>
            </th>
            <th scope="col">Template</th>
            <th scope="col">Language</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(({ id, language, template }) => (
            <tr key={id}>
              <td>
                <code>{id}</code>
              </td>
              <td>
                <Link to={docsLinkOf(template)}>{labelOf(template)}</Link>
              </td>
              <td>{languageNames[language]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const languageGroups: { label: string; languages: Language[] }[] = [
  { label: "TypeScript and JavaScript", languages: ["ts", "js"] },
  { label: "TypeScript only", languages: ["ts"] },
  { label: "JavaScript only", languages: ["js"] },
];

/** Which templates come in TypeScript, JavaScript or both */
export function LanguageSupport() {
  return (
    <ul>
      {languageGroups.map((group) => {
        const matching = templates.filter(
          (template) =>
            template.languages.length === group.languages.length &&
            group.languages.every((language) =>
              template.languages.includes(language),
            ),
        );

        if (!matching.length) return null;

        return (
          <li key={group.label}>
            {group.label}:{" "}
            {matching.map((template, index) => (
              <span key={template.id}>
                {index > 0 && "; "}
                <Link to={docsLinkOf(template)}>{labelOf(template)}</Link>
              </span>
            ))}
          </li>
        );
      })}
    </ul>
  );
}

/** The questions the CLI asks after the Game type, as it asks them */
const gameQuestions = [
  ...(games.length > 1
    ? [`a game (${either.format(games.map((game) => game.name))})`]
    : []),
  `a platform (${either.format(platforms.map((platform) => platform.name))})`,
  "whether it's multiplayer",
];

/** The choices of the "Select a type of template" prompt */
export function CategoryList() {
  return (
    <ul>
      {templatesByCategory.map((category) => (
        <li key={category.id}>
          <strong>{category.name}</strong>: {category.description}{" "}
          {category.id === "game"
            ? `Then pick ${both.format(gameQuestions)}.`
            : category.templates.length > 1
              ? `Then pick ${either.format(category.templates.map((template) => template.name))}.`
              : null}
        </li>
      ))}
    </ul>
  );
}
