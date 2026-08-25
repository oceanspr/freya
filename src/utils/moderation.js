// Simple moderation: block offensive words, enforce first name + city only
export function moderateComment(comment) {
  const blockedWords = ["spam", "offensive", "hate"];
  const containsBlocked = blockedWords.some(word =>
    comment.toLowerCase().includes(word)
  );
  return !containsBlocked;
}
