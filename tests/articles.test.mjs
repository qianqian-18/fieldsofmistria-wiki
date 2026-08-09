import assert from "node:assert/strict";
import test from "node:test";

test("publishes the approved nine English MDX pages with valid metadata", async () => {
  const { getPublishedArticles } = await import("../lib/content/articles.ts");
  const articles = await getPublishedArticles("en");
  assert.equal(articles.length, 9);
  for (const article of articles) {
    const { title, description, keyword, slug } = article.frontmatter;
    assert.ok(title.length >= 40 && title.length <= 60, `${slug} title length ${title.length}`);
    assert.ok(description.length >= 140 && description.length <= 160, `${slug} description length ${description.length}`);
    if (slug !== "beginner-guide") {
      assert.match(title.toLowerCase(), new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(description.toLowerCase(), new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});
