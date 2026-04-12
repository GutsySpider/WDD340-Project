// Import POI function + API key
import { getPOIs } from "./geoapify.mjs";
const GEOAPIFY_KEY = "b255022c09f24ddc86a3f9319fe279fd";

let map;
let markerLayer;
let markerMap = new Map(); // NEW: link POIs to markers


// Convert location name to coordinates

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

// Initialize the map

function initMap(lat, lon) {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl: "./public/images/leaflet/marker-icon.png",
    iconRetinaUrl: "./public/images/leaflet/marker-icon-2x.png",
    shadowUrl: "./public/images/leaflet/marker-shadow.png"
  });

  if (!map) {
    map = L.map("map").setView([lat, lon], 13);

    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`,
      { maxZoom: 20 }
    ).addTo(map);

    markerLayer = L.layerGroup().addTo(map);
  } else {
    map.setView([lat, lon], 13);
    markerLayer.clearLayers();
  }
}

// Render POIs as markers + sidebar list
function renderPOIsOnMap(pois) {
  markerLayer.clearLayers();
  markerMap.clear();

  const listContainer = document.getElementById("poi-list");
  listContainer.innerHTML = ""; // clear sidebar

  pois.forEach((poi, index) => {
    const [lon, lat] = poi.geometry.coordinates;

    if (!lat || !lon) {
      console.warn("Invalid POI coordinates:", poi);
      return;
    }

    
    const marker = L.marker([lat, lon]).addTo(markerLayer);
    markerMap.set(index, marker);

   
    marker.on("click", () => {
      highlightListItem(index);
      openPOIModal(poi);
    });

   
    const item = document.createElement("div");
    item.className = "poi-item";
    item.innerHTML = `
      <h4>${poi.properties.name || "Unnamed Place"}</h4>
      <p>${poi.properties.categories?.join(", ") || "N/A"}</p>
      <p>${poi.properties.address_line1 || ""}</p>
    `;

    
    item.addEventListener("click", () => {
      map.setView([lat, lon], 16);
      marker.fire("click");
    });

    listContainer.appendChild(item);
  });
}

// Highlight selected list item
function highlightListItem(index) {
  const items = document.querySelectorAll(".poi-item");
  items.forEach((el) => el.classList.remove("active"));
  items[index]?.classList.add("active");
}

// Modal for POI details
function openPOIModal(poi) {
  const modal = document.getElementById("poi-modal");
  const modalContent = document.getElementById("poi-modal-content");

  modalContent.innerHTML = `
    <h2>${poi.properties.name || "Unnamed Place"}</h2>
    <p><strong>Category:</strong> ${poi.properties.categories?.join(", ") || "N/A"}</p>
    <p><strong>Address:</strong> ${poi.properties.address_line1 || "N/A"}</p>
    <p><strong>Description:</strong> ${
      poi.properties.datasource?.raw?.description || "No description available"
    }</p>
  `;

  modal.style.display = "block";
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("poi-modal");
  if (modal.style.display === "block" && event.target === modal) {
    modal.style.display = "none";
  }
});

// Search handler
async function handleSearch() {
  const input = document.getElementById("location-input");
  const query = input.value.trim();

  if (!query) return alert("Please enter a location");

  try {
    const { lat, lon } = await geocodeLocation(query);
    const pois = await getPOIs(lat, lon);

    initMap(lat, lon);
    renderPOIsOnMap(pois);
  } catch (err) {
    alert(err.message);
  }
}

// Attach event listener
document.getElementById("search-btn").addEventListener("click", handleSearch);

document.getElementById("location-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
  }
});