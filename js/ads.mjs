// Load ads from JSON file
export async function loadVacationAds() {
  const response = await fetch("./data/vacationAds.json");
  if (!response.ok) throw new Error("Failed to load vacation ads JSON");

  const data = await response.json();
  return data.vacationAds;
}

// Render ads into container
export function renderVacationAds(ads, container) {
  container.innerHTML = "";

  ads.forEach((ad) => {
    const card = document.createElement("article");
    card.classList.add("ad-card");

    card.innerHTML = `
      <img src="${ad.image}" alt="${ad.title}" class="ad-image" />
      <h3>${ad.title}</h3>
      <p>${ad.description}</p>
      <p><strong>${ad.location}</strong></p>

      <h4>Popular Points of Interest:</h4>
      <ul>
        ${ad.pointsOfInterest.map((poi) => `<li>${poi}</li>`).join("")}
      </ul>
    `;

    container.appendChild(card);
  });
}