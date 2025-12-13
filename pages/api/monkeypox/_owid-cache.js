// pages/api/monkeypox/_owid-cache.js
import csv from "csvtojson";

const OWID_CSV_URL =
  "https://raw.githubusercontent.com/owid/monkeypox/main/owid-monkeypox-data.csv";

function getCache() {
  const g = globalThis;
  if (!g.__owid_monkeypox_cache) {
    g.__owid_monkeypox_cache = {
      ts: 0,
      byLocation: null,
      promise: null,
      ttlMs: 6 * 60 * 60 * 1000, // 6h
    };
  }
  return g.__owid_monkeypox_cache;
}

async function fetchTextWithTimeout(url, timeoutMs = 20_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok)
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

export async function getOwidByLocation() {
  const cache = getCache();
  const now = Date.now();

  if (cache.byLocation && now - cache.ts < cache.ttlMs) return cache.byLocation;
  if (cache.promise) return cache.promise;

  cache.promise = (async () => {
    const text = await fetchTextWithTimeout(OWID_CSV_URL);
    const rows = await csv().fromString(text);

    const byLoc = Object.create(null);

    for (const r of rows) {
      const loc = r.location;
      if (!loc) continue;

      // Keep only fields you chart / show
      const slim = {
        date: r.date,
        total_cases: r.total_cases,
        total_cases_per_million: r.total_cases_per_million,
        new_cases: r.new_cases,
        new_cases_smoothed: r.new_cases_smoothed,
        new_cases_per_million: r.new_cases_per_million,
        total_deaths: r.total_deaths,
        new_deaths: r.new_deaths,
      };

      (byLoc[loc] ||= []).push(slim);
    }

    cache.byLocation = byLoc;
    cache.ts = Date.now();
    cache.promise = null;

    return byLoc;
  })();

  return cache.promise;
}

export function downsampleToMax(points, maxPoints) {
  if (!Array.isArray(points)) return [];
  if (!maxPoints || points.length <= maxPoints) return points;

  const stride = Math.ceil(points.length / maxPoints);
  const out = [];
  for (let i = 0; i < points.length; i += stride) out.push(points[i]);
  return out;
}
