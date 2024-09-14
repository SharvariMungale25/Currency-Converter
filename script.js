const apiKey = 'dcda432667fd2cc3e8459eeb'; // Replace with your API key from ExchangeRate-API
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertButton = document.getElementById('convert');
const conversionResult = document.getElementById('conversion-result');
const loadingIndicator = document.getElementById('loading');

// List of supported currencies
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN', 'BRL', 'ZAR', 'NZD'];

// Populate currency select options
function populateCurrencies() {
    currencies.forEach(currency => {
        addOptionToSelect(fromCurrencySelect, currency);
        addOptionToSelect(toCurrencySelect, currency);
    });
}

// Add an option to a select element
function addOptionToSelect(selectElement, value) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
}

// Fetch conversion rates and perform conversion
async function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || !fromCurrency || !toCurrency) {
        conversionResult.textContent = 'Please fill in all fields with valid data.';
        return;
    }

    loadingIndicator.hidden = false;
    conversionResult.textContent = '';

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
        const data = await response.json();

        if (data.result === 'success') {
            const rate = data.conversion_rates[toCurrency];
            if (rate) {
                const convertedAmount = (amount * rate).toFixed(2);
                conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            } else {
                conversionResult.textContent = 'Conversion rate not found.';
            }
        } else {
            conversionResult.textContent = 'Error fetching conversion rates from the server.';
        }
    } catch (error) {
        conversionResult.textContent = 'There was an error connecting to the server.';
    } finally {
        loadingIndicator.hidden = true;
    }
}

// Initialize the currency options
populateCurrencies();

// Add event listener for conversion
convertButton.addEventListener('click', convertCurrency);
