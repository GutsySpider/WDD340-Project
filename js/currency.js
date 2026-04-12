import { getExchangeRate, currencySymbols } from "./currency.mjs";
import { loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {

  // Ensure header/footer are loaded BEFORE querying DOM
  await loadHeaderFooter();

  // Dropdown elements
  const fromSelect = document.getElementById("from-country");
  const toSelect = document.getElementById("to-country");

  // Supported currencies
  const countries = {
    "United States (USD)": "USD",
    "European Union (EUR)": "EUR",
    "United Kingdom (GBP)": "GBP",
    "Japan (JPY)": "JPY",
    "Australia (AUD)": "AUD",
    "Canada (CAD)": "CAD",
    "Switzerland (CHF)": "CHF",
    "China (CNY)": "CNY",
    "New Zealand (NZD)": "NZD",
    "Mexico (MXN)": "MXN",
    "Sweden (SEK)": "SEK",
    "Norway (NOK)": "NOK",
    "India (INR)": "INR"
  };

  // Populate dropdowns
  Object.entries(countries).forEach(([label, code]) => {
    fromSelect.add(new Option(label, code));
    toSelect.add(new Option(label, code));
  });

  // UI elements
  const findRateBtn = document.getElementById("find-rate-btn");
  const rateDisplay = document.getElementById("rate-display");
  const fromSymbol = document.getElementById("from-symbol");
  const toSymbol = document.getElementById("to-symbol");
  const rateValue = document.getElementById("rate-value");

  const converter = document.getElementById("converter");
  const amountInput = document.getElementById("amount-input");
  const convertedAmount = document.getElementById("converted-amount");

  let currentRate = null;

  // Fetch and display exchange rate
  findRateBtn.addEventListener("click", async () => {
    const from = fromSelect.value;
    const to = toSelect.value;

    if (!from || !to) {
      alert("Please select both countries");
      return;
    }

    try {
      const data = await getExchangeRate(from);
      currentRate = data.conversion_rates[to];

      
      fromSymbol.textContent = currencySymbols[from] || from;
      toSymbol.textContent = currencySymbols[to] || to;

      
      rateValue.textContent = `1 ${from} = ${currentRate} ${to}`;

      
      rateDisplay.classList.remove("hidden");
      converter.classList.remove("hidden");

    } catch (err) {
      alert("Error fetching exchange rate");
    }
  });

 // Auto-update conversion
amountInput.addEventListener("input", () => {
  if (!currentRate) return;

  const amount = parseFloat(amountInput.value);
  if (isNaN(amount)) {
    convertedAmount.textContent = "";
    return;
  }

  const symbol = currencySymbols[toSelect.value] || toSelect.value;
  const result = (amount * currentRate).toFixed(2);

  convertedAmount.textContent = `${symbol} ${result}`;
});
});