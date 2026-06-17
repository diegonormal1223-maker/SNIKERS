const currencyLabels = {
    USD: 'Dólar estadounidense',
    COP: 'Peso Colombiano',
    EUR: 'Euro',
    GBP: 'Libra Esterlina'
};

let currentPriceUSD = 0;
const fallbackRates = {
    COP: 4800,
    EUR: 0.93,
    GBP: 0.81
};
let exchangeRates = {
    USD: 1,
    COP: fallbackRates.COP,
    EUR: fallbackRates.EUR,
    GBP: fallbackRates.GBP
};

function getLocaleForCurrency(currency) {
    const localeMap = {
        USD: 'en-US',
        COP: 'es-CO',
        EUR: 'de-DE',
        GBP: 'en-GB'
    };
    return localeMap[currency] || 'en-US';
}

function formatCurrency(amount, currency) {
    const digits = currency === 'COP' ? 0 : 2;
    return new Intl.NumberFormat(getLocaleForCurrency(currency), {
        style: 'currency',
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }).format(amount);
}

function setConvertedPriceText(message) {
    const convertedPriceElement = document.getElementById('convertedPrice');
    if (convertedPriceElement) {
        convertedPriceElement.textContent = message;
    }
}

async function loadExchangeRates() {
    try {
        setConvertedPriceText('Cargando tasas de cambio...');
        const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=COP,EUR,GBP');

        if (!response.ok) {
            throw new Error('Error al obtener tasas de cambio');
        }

            const data = await response.json();
        if (data && data.rates) {
            exchangeRates.COP = data.rates.COP || fallbackRates.COP;
            exchangeRates.EUR = data.rates.EUR || fallbackRates.EUR;
            exchangeRates.GBP = data.rates.GBP || fallbackRates.GBP;
        } else {
            exchangeRates.COP = fallbackRates.COP;
            exchangeRates.EUR = fallbackRates.EUR;
            exchangeRates.GBP = fallbackRates.GBP;
        }

        if (currentPriceUSD > 0) {
            updateConvertedPrice();
        } else {
            setConvertedPriceText('Selecciona la moneda y presiona convertir');
        }
    } catch (error) {
        console.error('Error de conversión de moneda:', error);
        exchangeRates.COP = fallbackRates.COP;
        exchangeRates.EUR = fallbackRates.EUR;
        exchangeRates.GBP = fallbackRates.GBP;
        if (currentPriceUSD > 0) {
            setConvertedPriceText('Tasas de cambio no disponibles, usando valores aproximados.');
            updateConvertedPrice();
        } else {
            setConvertedPriceText('Selecciona la moneda y presiona convertir');
        }
    }
}

function updateConvertedPrice() {
    const currencySelector = document.getElementById('currencySelector');
    if (!currencySelector) return;

    const targetCurrency = currencySelector.value;
    if (targetCurrency === 'USD') {
        setConvertedPriceText(`Precio original: ${formatCurrency(currentPriceUSD, 'USD')}`);
        return;
    }

    const rate = exchangeRates[targetCurrency];
    if (!rate || currentPriceUSD <= 0) {
        setConvertedPriceText('No hay datos disponibles para la conversión');
        return;
    }

    const convertedAmount = currentPriceUSD * rate;
    const currencyLabel = currencyLabels[targetCurrency] || targetCurrency;

    setConvertedPriceText(`Equivale a ${formatCurrency(convertedAmount, targetCurrency)} (${currencyLabel})`);
}

function initializeCurrencyConverter() {
    const currencySelector = document.getElementById('currencySelector');
    const convertButton = document.getElementById('convertCurrencyBtn');

    if (currencySelector) {
        currencySelector.addEventListener('change', updateConvertedPrice);
    }

    if (convertButton) {
        convertButton.addEventListener('click', updateConvertedPrice);
    }

    document.addEventListener('snkrProductLoaded', event => {
        if (event.detail && event.detail.priceUSD) {
            currentPriceUSD = parseFloat(event.detail.priceUSD) || 0;
            updateConvertedPrice();
            loadExchangeRates();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCurrencyConverter);
} else {
    initializeCurrencyConverter();
}
