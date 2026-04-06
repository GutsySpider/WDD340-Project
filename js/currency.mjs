const CURRENCY_KEY = import.meta.env.VITE_CURRENCY_KEY;

export async function getExchangeRate(base = "USD") {
  const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_KEY}/latest/${base}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch exchange rates");

  return response.json();
}