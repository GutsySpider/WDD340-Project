import { loadHeaderFooter } from "./utils.mjs";
import { renderVacationAds, vacationAds } from "./ads.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const adsContainer = document.querySelector("#vacation-ads");
  if (adsContainer) {
    renderVacationAds(vacationAds, adsContainer);
  }

  await loadHeaderFooter();


  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#mobile-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("hidden");
    });
  }
});