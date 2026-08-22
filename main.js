import { useKeyManagement } from "./hooks/useKeyManagement.js";
import { usePasswordRotation } from "./hooks/usePasswordRotation.js";
import { useRollback } from "./hooks/useRollback.js";
import { useAudit } from "./hooks/useAudit.js";
import { useNotification } from "./hooks/useNotification.js";

async function main() {
  const dryRun = process.env.DRY_RUN === "true"; // toggle with env var

  try {
    console.log("🔑 Running Key Management...");
    const keys = await useKeyManagement({
      keysDir: "./keys",
      notifyEmails: process.env.NOTIFY_EMAILS,
      smtpConfig: {
        host: process.env.SMTP_HOST,
        port: 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      slackWebhook: process.env.SLACK_WEBHOOK,
      githubRepo: process.env.GITHUB_REPOSITORY,
      dryRun
    });

    console.log("🔒 Rotating Netlify Passwords...");
    const rotationResult = await usePasswordRotation({
      siteId: process.env.NETLIFY_SITE_ID,
      authToken: process.env.NETLIFY_AUTH_TOKEN,
      repo: process.env.GITHUB_REPOSITORY,
      pgpKeys: keys.map((k) => k.armored),
      notifyEmails: process.env.NOTIFY_EMAILS,
      smtpConfig: {
        host: process.env.SMTP_HOST,
        port: 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      dryRun
    });

    console.log("📊 Generating Audit Report...");
    await useAudit(rotationResult, { dryRun });

    console.log(dryRun ? "✅ Dry‑run completed (no changes made)." : "✅ Rotation cycle completed successfully.");
  } catch (err) {
    console.error("❌ Rotation failed:", err);

    if (!dryRun) {
      console.log("↩️ Initiating rollback...");
      await useRollback({
        repo: process.env.GITHUB_REPOSITORY,
        backupFile: "./secrets_backup.env"
      });

      await useNotification({
        channel: "slack",
        webhook: process.env.SLACK_WEBHOOK,
        message: "⚠️ Rotation failed. Secrets restored from backup."
      });
    } else {
      console.log("⚠️ Dry‑run failed, but no secrets were changed.");
    }
  }
}

main();

