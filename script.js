// Extensive list of all world currencies
const currencies = {
    'USD': 'United States Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound Sterling',
    'JPY': 'Japanese Yen',
    'AUD': 'Australian Dollar',
    'CAD': 'Canadian Dollar',
    'CHF': 'Swiss Franc',
    'CNY': 'Chinese Yuan',
    'HKD': 'Hong Kong Dollar',
    'NZD': 'New Zealand Dollar',
    'SEK': 'Swedish Krona',
    'KRW': 'South Korean Won',
    'SGD': 'Singapore Dollar',
    'NOK': 'Norwegian Krone',
    'MXN': 'Mexican Peso',
    'INR': 'Indian Rupee',
    'RUB': 'Russian Ruble',
    'ZAR': 'South African Rand',
    'TRY': 'Turkish Lira',
    'BRL': 'Brazilian Real',
    'TWD': 'New Taiwan Dollar',
    'DKK': 'Danish Krone',
    'PLN': 'Polish Zloty',
    'THB': 'Thai Baht',
    'IDR': 'Indonesian Rupiah',
    'HUF': 'Hungarian Forint',
    'CZK': 'Czech Koruna',
    'ILS': 'Israeli New Shekel',
    'CLP': 'Chilean Peso',
    'PHP': 'Philippine Peso',
    'AED': 'UAE Dirham',
    'COP': 'Colombian Peso',
    'SAR': 'Saudi Riyal',
    'MYR': 'Malaysian Ringgit',
    'RON': 'Romanian Leu',
    'AFN': 'Afghan Afghani',
    'ALL': 'Albanian Lek',
    'DZD': 'Algerian Dinar',
    'ARS': 'Argentine Peso',
    'AMD': 'Armenian Dram',
    'AZN': 'Azerbaijani Manat',
    'BHD': 'Bahraini Dinar',
    'BDT': 'Bangladeshi Taka',
    'BBD': 'Barbadian Dollar',
    'BYN': 'Belarusian Ruble',
    'BOB': 'Bolivian Boliviano',
    'BAM': 'Bosnia-Herzegovina Mark',
    'BGN': 'Bulgarian Lev',
    'KHR': 'Cambodian Riel',
    'CRC': 'Costa Rican Colón',
    'HRK': 'Croatian Kuna',
    'CUP': 'Cuban Peso',
    'DOP': 'Dominican Peso',
    'EGP': 'Egyptian Pound',
    'GEL': 'Georgian Lari',
    'GHS': 'Ghanaian Cedi',
    'GTQ': 'Guatemalan Quetzal',
    'HNL': 'Honduran Lempira',
    'ISK': 'Icelandic Króna',
    'IQD': 'Iraqi Dinar',
    'JMD': 'Jamaican Dollar',
    'JOD': 'Jordanian Dinar',
    'KZT': 'Kazakhstani Tenge',
    'KES': 'Kenyan Shilling',
    'KWD': 'Kuwaiti Dinar',
    'LBP': 'Lebanese Pound',
    'LKR': 'Sri Lankan Rupee',
    'MAD': 'Moroccan Dirham',
    'MDL': 'Moldovan Leu',
    'MMK': 'Burmese Kyat',
    'NAD': 'Namibian Dollar',
    'NPR': 'Nepalese Rupee',
    'NGN': 'Nigerian Naira',
    'OMR': 'Omani Rial',
    'PKR': 'Pakistani Rupee',
    'PAB': 'Panamanian Balboa',
    'PYG': 'Paraguayan Guarani',
    'PEN': 'Peruvian Sol',
    'QAR': 'Qatari Riyal',
    'RSD': 'Serbian Dinar',
    'SOS': 'Somali Shilling',
    'TJS': 'Tajikistani Somoni',
    'TZS': 'Tanzanian Shilling',
    'TND': 'Tunisian Dinar',
    'UGX': 'Ugandan Shilling',
    'UAH': 'Ukrainian Hryvnia',
    'UYU': 'Uruguayan Peso',
    'UZS': 'Uzbekistani Som',
    'VEF': 'Venezuelan Bolívar',
    'VND': 'Vietnamese Dong',
    'YER': 'Yemeni Rial',
    'ZMW': 'Zambian Kwacha'
};

let exchangeRates = {};

// DOM Elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const resultDisplay = document.getElementById('finalResult');
const subResult = document.getElementById('conversionRate');
const targetNameDisplay = document.getElementById('targetName');
const lastUpdate = document.getElementById('lastUpdate');
const popularRatesList = document.getElementById('popularRates');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

// --- Initialization ---
function init() {
    populateDropdowns();
    fetchRates();
    loadTheme();
}

// --- Populate Dropdowns ---
function populateDropdowns() {
    const codes = Object.keys(currencies).sort();
    
    codes.forEach(code => {
        const optionFrom = new Option(`${code} - ${currencies[code]}`, code);
        const optionTo = new Option(`${code} - ${currencies[code]}`, code);
        
        fromSelect.add(optionFrom);
        toSelect.add(optionTo);
    });

    // Defaults
    fromSelect.value = 'USD';
    toSelect.value = 'INR';
    
    updateFlags();
}

// --- Flag Handling ---
// Helper to map currency code to country code for FlagCDN
function getCountryCode(currencyCode) {
    // Handle special cases
    const special = {
        'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'INR': 'in', 
        'AUD': 'au', 'JPY': 'jp', 'CNY': 'cn', 'BTC': 'bt'
    };
    if (special[currencyCode]) return special[currencyCode];
    return currencyCode.slice(0, 2).toLowerCase();
}

function updateFlags() {
    const fromCode = fromSelect.value;
    const toCode = toSelect.value;
    
    fromFlag.src = `https://flagcdn.com/w40/${getCountryCode(fromCode)}.png`;
    toFlag.src = `https://flagcdn.com/w40/${getCountryCode(toCode)}.png`;
}

// --- API Fetching ---
async function fetchRates() {
    // Show loading state
    resultDisplay.style.opacity = '0.5';
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        exchangeRates = data.rates;
        
        const date = new Date(data.date);
        lastUpdate.textContent = `Updated: ${date.toLocaleTimeString()}`;
        
        calculateResult();
        updateMarketDashboard();
        
        resultDisplay.style.opacity = '1';
    } catch (error) {
        alert("Error fetching rates. Check internet connection.");
        console.error(error);
    }
}

// --- Calculation Logic ---
function calculateResult() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    
    if (isNaN(amount)) {
        resultDisplay.innerText = "0.00";
        return;
    }

    // Rate Calculation: (USD to Target) / (USD to Base)
    const rate = exchangeRates[to] / exchangeRates[from];
    const finalAmount = amount * rate;

    // Formatting numbers with commas
    resultDisplay.innerText = finalAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    subResult.innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    targetNameDisplay.innerText = currencies[to] || to;
}

// --- Market Dashboard Logic ---
function updateMarketDashboard() {
    // Display major currencies relative to the SELECTED "From" currency
    const base = fromSelect.value;
    const baseRateInUSD = exchangeRates[base];
    
    const popularList = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD'];
    popularRatesList.innerHTML = ''; // Clear old

    document.getElementById('baseCurrencyDisplay').innerText = base;

    popularList.forEach(curr => {
        if (curr === base) return; // Don't show self

        const targetRateInUSD = exchangeRates[curr];
        const crossRate = targetRateInUSD / baseRateInUSD;

        const item = document.createElement('div');
        item.className = 'rate-item';
        item.innerHTML = `
            <div class="curr-info">
                <img src="https://flagcdn.com/w40/${getCountryCode(curr)}.png" alt="">
                <span>${curr}</span>
            </div>
            <span class="rate-val">${crossRate.toFixed(4)}</span>
        `;
        popularRatesList.appendChild(item);
    });
}

// --- Event Listeners ---
fromSelect.addEventListener('change', () => {
    updateFlags();
    calculateResult();
    updateMarketDashboard();
});

toSelect.addEventListener('change', () => {
    updateFlags();
    calculateResult();
});

amountInput.addEventListener('input', calculateResult);

document.getElementById('swapBtn').addEventListener('click', () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    updateFlags();
    calculateResult();
    updateMarketDashboard();
});

document.getElementById('convertBtn').addEventListener('click', calculateResult);

// --- Theme Toggle ---
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
        localStorage.setItem('theme', 'dark');
    }
});

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
    }
}

// Start app
init();
