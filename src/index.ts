import * as core from "@actions/core";

const BUNNY_API_BASE = "https://api.bunny.net";

try {
  const apiKey = core.getInput("api_key", { required: true });
  const rawIds = core.getInput("pull_zone_ids", { required: true });

  const pullZoneIds = rawIds
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (pullZoneIds.length === 0) {
    core.setFailed("No pull zone IDs provided.");
    process.exit(1);
  }

  core.info(
    `🐰 Purging ${pullZoneIds.length} pull zone(s): ${pullZoneIds.join(", ")}`
  );

  const results = await Promise.allSettled(
    pullZoneIds.map((id) => purgePullZone(apiKey, id))
  );

  const purged: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i]!;
    const id = pullZoneIds[i]!;

    if (result.status === "fulfilled") {
      purged.push(id);
      core.info(`  ✓ Pull zone ${id} — purged successfully`);
    } else {
      failed.push(id);
      core.error(`  ✗ Pull zone ${id} — ${result.reason}`);
    }
  }

  core.setOutput("purged_zones", purged.join(","));
  core.setOutput("failed_zones", failed.join(","));

  if (failed.length > 0) {
    core.setFailed(
      `${failed.length} of ${pullZoneIds.length} pull zone purge(s) failed.`
    );
  } else {
    core.info("All pull zones purged successfully.");
  }
} catch (error) {
  core.setFailed(
    error instanceof Error ? error.message : "An unexpected error occurred."
  );
}

async function purgePullZone(
  apiKey: string,
  pullZoneId: string
): Promise<void> {
  const url = `${BUNNY_API_BASE}/pullzone/${encodeURIComponent(pullZoneId)}/purgeCache`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      AccessKey: apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "<no body>");
    throw new Error(
      `HTTP ${response.status} ${response.statusText} — ${body}`
    );
  }
}
