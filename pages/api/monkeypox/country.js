// pages/api/monkeypox/country.js
import { getOwidByLocation, downsampleToMax } from "./_owid-cache";

export default async function handler(req, res) {
  const location = String(req.query.location || "");
  if (!location) {
    res.status(400).json({ error: "Missing ?location=" });
    return;
  }

  const maxPoints = Number(req.query.maxPoints || 600);

  try {
    const byLoc = await getOwidByLocation();
    const pointsRaw = byLoc[location] || [];
    const points = downsampleToMax(pointsRaw, maxPoints);

    // Cache at Vercel edge
    res.setHeader(
      "Cache-Control",
      "s-maxage=21600, stale-while-revalidate=86400"
    );
    res.status(200).json({ location, points });
  } catch (e) {
    res.status(502).json({ error: "Failed to load OWID data" });
  }
}
