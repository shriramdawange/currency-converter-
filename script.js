// Currency data with common currencies
const currencies = {
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
    'AUD': 'Australian Dollar',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee',
    'MXN': 'Mexican Peso',
    'BRL': 'Brazilian Real',
    'ZAR': 'South African Rand',
    'RUB': 'Russian Ruble',
    'KRW': 'South Korean Won',
    'SGD': 'Singapore Dollar',
    'HKD': 'Hong Kong Dollar',
    'NOK': 'Norwegian Krone',
    'SEK': 'Swedish Krona',
    'DKK': 'Danish Krone',
    'NZD': 'New Zealand Dollar',
    'TRY': 'Turkish Lira',
    'AED': 'UAE Dirham',
    'SAR': 'Saudi Riyal',
    'THB': 'Thai Baht',
    'PLN': 'Polish Zloty'
};

let exchangeRates = {};

// DOM elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const result = document.getElementById('result');
const rateInfo = document.getElementById('rateInfo');
const lastUpdate = document.getElementById('lastUpdate');

// Populate currency dropdowns
function populateCurrencies() {
    const sortedCurrencies = Object.keys(currencies).sort();
    
    sortedCurrencies.forEach(code => {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.textContent = `${code} - ${currencies[code]}`;
        fromCurrency.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = code;
        option2.textContent = `${code} - ${currencies[code]}`;
        toCurrency.appendChild(option2);
    });
    
    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
}

// Fetch exchange rates from API
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        exchangeRates = data.rates;
        
        const date = new Date(data.date);
        lastUpdate.textContent = `Last updated: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        return true;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        lastUpdate.textContent = 'Error loading exchange rates. Please try again later.';
        return false;
    }
}

// Convert currency
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    if (isNaN(amount) || amount <= 0) {
        result.innerHTML = '<p class="result-text" style="color: #e74c3c;">Please enter a valid amount</p>';
        return;
    }
    
    if (!exchangeRates[from] || !exchangeRates[to]) {
        result.innerHTML = '<p class="result-text" style="color: #e74c3c;">Exchange rate not available</p>';
        return;
    }
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[from];
    const convertedAmount = amountInUSD * exchangeRates[to];
    
    // Calculate exchange rate
    const rate = exchangeRates[to] / exchangeRates[from];
    
    result.innerHTML = `
        <p class="result-text" style="color: #27ae60;">
            ${amount.toFixed(2)} ${from} = ${convertedAmount.toFixed(2)} ${to}
        </p>
    `;
    
    rateInfo.innerHTML = `
        <strong>Exchange Rate:</strong> 1 ${from} = ${rate.toFixed(4)} ${to}<br>
        <strong>Inverse Rate:</strong> 1 ${to} = ${(1/rate).toFixed(4)} ${from}
    `;
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertCurrency();
    }
}

// Event listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Convert on Enter key
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Auto-convert when currency changes
fromCurrency.addEventListener('change', () => {
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertCurrency();
    }
});

toCurrency.addEventListener('change', () => {
    if (amountInput.value && parseFloat(amountInput.value) > 0) {
        convertCurrency();
    }
});

// Initialize
populateCurrencies();
fetchExchangeRates();
