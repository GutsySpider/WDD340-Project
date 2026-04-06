const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

export async function getPOIs(lat, lon, radius = 5000) {
  const url = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${GEOAPIFY_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch POIs");

  const data = await response.json();
  return data.features;
}