import fs from "fs";
import matter from "gray-matter";

export function loadMarkdownPosts() {
  const context = import.meta.glob("../posts/*.md", { eager: true });
  return Object.keys(context).map((key) => {
    const file = context[key];
    const { data, content } = matter(file.default);
    return { ...data, content };
  });
}
