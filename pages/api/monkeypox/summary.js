// pages/api/monkeypox/summary.js
import { getOwidByLocation } from "./_owid-cache";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default async function handler(req, res) {
  const location = String(req.query.location || "");
  if (!location) {
    res.status(400).json({ error: "Missing ?location=" });
    return;
  }

  try {
    const byLoc = await getOwidByLocation();
    const arr = byLoc[location] || [];
    const last = arr.length ? arr[arr.length - 1] : null;

    res.setHeader(
      "Cache-Control",
      "s-maxage=21600, stale-while-revalidate=86400"
    );
    res.status(200).json({
      location,
      date: last?.date || null,
      total_cases: toNum(last?.total_cases),
      new_cases: toNum(last?.new_cases),
      new_deaths: toNum(last?.new_deaths),
      total_deaths: toNum(last?.total_deaths),
    });
  } catch {
    res.status(502).json({ error: "Failed to load OWID summary" });
  }
}
