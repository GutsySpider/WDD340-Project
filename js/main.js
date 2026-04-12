import { loadHeaderFooter } from "./utils.mjs";
import { loadVacationAds, renderVacationAds } from "./ads.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const adsContainer = document.querySelector("#vacation-ads");

  // Load ads dynamically from JSON
  if (adsContainer) {
    try {
      const ads = await loadVacationAds();
      renderVacationAds(ads, adsContainer);
    } catch (err) {
      console.error("Error loading vacation ads:", err);
    }
  }

  // Load header & footer
  await loadHeaderFooter();

  // Mobile menu toggle
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#mobile-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("hidden");
    });
  }
});