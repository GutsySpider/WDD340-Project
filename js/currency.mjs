const CURRENCY_KEY = "f1a5a0a3b1ae67618f868755";

// Fetch exchange rates for a base currency
export async function getExchangeRate(base = "USD") {
  const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_KEY}/latest/${base}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch exchange rates");

  return response.json();
}

// Local currency symbol map (fast + reliable)
export const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  NZD: "NZ$",
  MXN: "$",
  SEK: "kr",
  NOK: "kr",
  INR: "₹"
};