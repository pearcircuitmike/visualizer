// pages/api/monkeypox/countries-summary.js
import { csv } from "csvtojson";

const OWID_CSV_URL =
  "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// cache in memory per serverless instance
let cached = null;
let cachedAt = 0;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (cached && now - cachedAt < TTL_MS) {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=21600, stale-while-revalidate=86400"
      );
      return res.status(200).json(cached);
    }

    const r = await fetch(OWID_CSV_URL);
    if (!r.ok) {
      return res.status(502).json({ error: "Failed to fetch OWID CSV" });
    }

    const text = await r.text();
    const rows = await csv().fromString(text);

    // Build a tiny map: location -> latest totals
    const byLocation = Object.create(null);
    for (const row of rows) {
      const loc = row.location;
      if (!loc) continue;

      // rows appear in date order per location; last wins
      byLocation[loc] = {
        date: row.date || null,
        total_cases: toNum(row.total_cases),
        total_deaths: toNum(row.total_deaths),
      };
    }

    cached = { byLocation };
    cachedAt = now;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=21600, stale-while-revalidate=86400"
    );
    return res.status(200).json(cached);
  } catch (e) {
    return res.status(502).json({ error: "Failed to build summary" });
  }
}
