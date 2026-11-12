import { expect, it } from "vitest";

import { fillPlaceholders } from "../src/scaffold.ts";

it("escapes placeholder values for package.json", () => {
  const author = 'Ann "Q" O\\Brien';
  const filled = fillPlaceholders(
    "package.json",
    '{ "author": "{{author}}" }',
    {
      packageName: "app",
      author,
    },
  );

  expect(JSON.parse(filled).author).toBe(author);
});
