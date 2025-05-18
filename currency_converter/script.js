const fakeExchangeRates = {
    USD: {
        EUR: 0.9,
        GBP: 0.75,
        JPY: 110
    },
    EUR: {
        USD: 1.11,
        GBP: 0.83,
        JPY: 122
    },
    GBP: {
        USD: 1.33,
        EUR: 1.2,
        JPY: 147
    },
    JPY: {
        USD: 0.0091,
        EUR: 0.0082,
        GBP: 0.0068
    }
};

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertButton = document.getElementById('convert-btn');
const convertedAmountPara = document.getElementById('converted-amount');

function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount)) {
        convertedAmountPara.textContent = 'Please enter a valid amount.';
        return;
    }

    if (fromCurrency === toCurrency) {
        convertedAmountPara.textContent = `${amount} ${fromCurrency} is equal to ${amount} ${toCurrency}`;
        return;
    }

    const rate = fakeExchangeRates[fromCurrency][toCurrency];

    if (rate) {
        const convertedAmount = amount * rate;
        convertedAmountPara.textContent = `${amount} ${fromCurrency} is equal to ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } else {
        convertedAmountPara.textContent = 'Conversion not available for these currencies.';
    }
}

// Add event listener to the convert button
convertButton.addEventListener('click', convertCurrency);

// Perform a default conversion on page load
convertCurrency(); 