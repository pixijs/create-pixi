import fs from "node:fs";
import path from "node:path";

interface Placeholders {
  packageName: string;
  author?: string;
}

// Files that can contain placeholders, and how to escape values for them
const placeholderFiles: Record<string, (value: string) => string> = {
  "package.json": (value) => JSON.stringify(value).slice(1, -1),
  LICENSE: (value) => value,
};

// npm strips .gitignore files from published packages
const renameFiles: Record<string, string> = {
  _gitignore: ".gitignore",
};

/** Copies a generated template into `targetDir` and fills its placeholders */
export function scaffold(
  templateDir: string,
  targetDir: string,
  placeholders: Placeholders,
) {
  fs.cpSync(templateDir, targetDir, { recursive: true });

  for (const file of [
    ...Object.keys(renameFiles),
    ...Object.keys(placeholderFiles),
  ]) {
    const source = path.join(targetDir, file);

    if (!fs.existsSync(source)) continue;

    const [name, content] = prepareFile(
      file,
      fs.readFileSync(source),
      placeholders,
    );

    fs.rmSync(source);
    fs.writeFileSync(path.join(targetDir, name), content);
  }
}

/** The name and content a top-level template file gets in a new project */
export function prepareFile(
  file: string,
  content: Buffer | string,
  placeholders: Placeholders,
) {
  return [
    renameFiles[file] ?? file,
    Object.hasOwn(placeholderFiles, file)
      ? fillPlaceholders(file, String(content), placeholders)
      : content,
  ] as const;
}

/** Replaces `{{packageName}}`, `{{author}}` and `{{year}}` in a template file */
export function fillPlaceholders(
  file: string,
  text: string,
  placeholders: Placeholders,
) {
  const escape = placeholderFiles[file];
  const values: Record<string, string> = {
    ...placeholders,
    author: placeholders.author ?? "",
    year: String(new Date().getFullYear()),
  };

  return text.replace(/\{\{(packageName|author|year)\}\}/g, (_, key: string) =>
    escape(values[key]),
  );
}
