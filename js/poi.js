import { getPOIs } from "./geoapify.mjs";
const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

// 1. Convert location name to coordinates
async function geocodeLocation(locationName) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    locationName
  )}&format=json&apiKey=${GEOAPIFY_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to geocode location");

  const data = await response.json();
  if (!data.results.length) throw new Error("Location not found");

  const { lat, lon } = data.results[0];
  return { lat, lon };
}

// 2. Render POIs to the page
function renderPOIs(pois) {
  const container = document.getElementById("poi-results");
  container.innerHTML = "";

  if (pois.length === 0) {
    container.innerHTML = "<p>No points of interest found.</p>";
    return;
  }

  pois.forEach((poi) => {
    const card = document.createElement("div");
    card.classList.add("poi-card");

    card.innerHTML = `
      <h3>${poi.properties.name || "Unnamed Place"}</h3>
      <p><strong>Category:</strong> ${poi.properties.categories?.join(", ") || "N/A"}</p>
      <p><strong>Address:</strong> ${poi.properties.address_line1 || "N/A"}</p>
    `;

    container.appendChild(card);
  });
}

// 3. Search handler
async function handleSearch() {
  const input = document.getElementById("location-input");
  const query = input.value.trim();

  if (!query) return alert("Please enter a location");

  try {
    const { lat, lon } = await geocodeLocation(query);
    const pois = await getPOIs(lat, lon);
    renderPOIs(pois);
  } catch (err) {
    alert(err.message);
  }
}

// 4. Attach event listener
document.getElementById("search-btn").addEventListener("click", handleSearch);