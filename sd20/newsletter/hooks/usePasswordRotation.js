import { execSync } from "child_process";

export async function usePasswordRotation({ siteId, authToken, repo, dryRun }) {
  const users = ["admin", "editor", "viewer"];
  const rotated = {};

  for (const user of users) {
    const newPassword = Math.random().toString(36).slice(-12);
    rotated[user] = newPassword;

    if (!dryRun) {
      execSync(`gh secret set NETLIFY_${user.toUpperCase()}_PASSWORD --body "${newPassword}" --repo ${repo}`);
    }
  }

  return rotated;
}

