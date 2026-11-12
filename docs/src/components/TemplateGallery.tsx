import Link from "@docusaurus/Link";
import { createCommandParts } from "@site/src/data/commands";
import type { PackageManager } from "@site/src/data/commands";
import { docsLinkOf, templatesByCategory } from "@site/src/data/templates";
import { languageNames, variantOf } from "@templates/manifest";
import type { TemplateDefinition } from "@templates/manifest";
import { useState } from "react";

import CommandLine from "./CommandLine";
import Segmented from "./Segmented";

import styles from "./TemplateGallery.module.css";

function TemplateRow({
  template,
  pm,
}: {
  template: TemplateDefinition;
  pm: PackageManager;
}) {
  const [language, setLanguage] = useState(template.languages[0]);
  const command = createCommandParts(pm, {
    dir: "my-app",
    template: variantOf(template, language)?.id,
  });

  return (
    <li className={styles.template}>
      <div className={styles.templateHead}>
        <h4 className={styles.templateName}>{template.name}</h4>
        {template.languages.length > 1 ? (
          <Segmented
            legend={`${template.name} language`}
            options={template.languages.map((value) => ({
              value,
              label: languageNames[value],
            }))}
            value={language}
            onChange={setLanguage}
          />
        ) : (
          <span className={styles.only}>{languageNames[language]} only</span>
        )}
      </div>
      <p className={styles.description}>{template.description}</p>
      <CommandLine
        variant="row"
        {...command}
        copyLabel={`Copy the ${template.name} ${languageNames[language]} command`}
      />
      <Link
        className={styles.docs}
        to={docsLinkOf(template)}
        aria-label={`${template.name} template guide`}
      >
        Template guide
      </Link>
    </li>
  );
}

export default function TemplateGallery({ pm }: { pm: PackageManager }) {
  return (
    <div className={styles.gallery}>
      {templatesByCategory.map((category) => (
        <section
          key={category.id}
          className={styles.category}
          aria-labelledby={`category-${category.id}`}
        >
          <div className={styles.categoryHead}>
            <h3 id={`category-${category.id}`} className={styles.categoryName}>
              {category.name}
            </h3>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
          <ul className={styles.templates}>
            {category.templates.map((template) => (
              <TemplateRow key={template.id} template={template} pm={pm} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
