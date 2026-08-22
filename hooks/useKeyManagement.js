import fs from "fs";
import path from "path";
import * as openpgp from "openpgp";
import { execSync } from "child_process";

export async function useKeyManagement({ keysDir, githubRepo, dryRun }) {
  const files = fs.readdirSync(keysDir);
  const keys = [];

  for (const file of files) {
    if (!file.endsWith(".asc")) continue;
    const armored = fs.readFileSync(path.join(keysDir, file), "utf8");
    const key = await openpgp.readKey({ armoredKey: armored });
    const expiration = await key.getExpirationTime();

    if (expiration && expiration < new Date()) continue;
    if (await key.isRevoked()) continue;

    keys.push({ armored, fingerprint: key.getFingerprint() });
  }

  if (!dryRun && githubRepo) {
    const combinedKeys = keys.map(k => k.armored).join("|||");
    execSync(`gh secret set PGP_PUBLIC_KEYS --body "${combinedKeys}" --repo ${githubRepo}`);
  }

  return keys;
}

