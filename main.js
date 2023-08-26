const url = 'https://www.cbr-xml-daily.ru/daily_json.js';


// значение доллара
async function get_usd(url) {
    let response = await fetch(url);
    let result = await response.json();
    const current_usd_price = result.Valute.USD.Value;
    return Math.round(current_usd_price);
}


// Значение евро
async function get_eur(url) {
    let response = await fetch(url);
    let result = await response.json();
    const current_eur_price = result.Valute.EUR.Value;
    return Math.round(current_eur_price);
}


async function get_valute(url, valute) {
    let response = await fetch(url);
    let result = await response.json();
    const current_valute_price = result.Valute[valute].Value;
    return current_valute_price;
}


function valuteToRub(count, valute) {
    let amountRub = count * valute;
    return amountRub;
}


function rubToValute(count, valute) {
    let amountValute = count / valute;
    return amountValute;
}


async function getValutes(url) {
    let response = await fetch(url);
    let result = await response.json();
    const valute_json = result.Valute;
    let codeList = [];
    for (let code in valute_json) {
        codeList.push(code);
    }
    return codeList;
}

async function calculateCurrencySelect() {
    const valuteList = await getValutes(url)
    const currencySelect = document.getElementById('currencySelect');

    valuteList.forEach(valute => {
        const option = document.createElement('option');
        option.value = valute
        option.text = valute
        currencySelect.appendChild(option);
    })
}


const btn = document.getElementById('btn-calculate')
btn.addEventListener('click', async () => {
    const currency = document.getElementById('currencySelect').value
    const amountCurrency = document.getElementById('amountCurrency').value
    const amountValute = await get_valute(url, currency)
    const conv_valute = document.querySelector('.converter-p')
    const count = document.getElementById('amountCurrency').value
    const converter_to_rub = valuteToRub(count, amountValute)
    const converter_to_valute = rubToValute(count, amountValute)
    const radios = document.querySelectorAll('input[name="radioInline"]');
    const selectedRadio = Array.from(radios).find(radio => radio.checked);
    if (selectedRadio.value==='from') {
        conv_valute.textContent = `${count} ${currency} будет равно: ${converter_to_rub.toFixed(2)} рублей`
    } else if (selectedRadio.value==='to') {
        conv_valute.textContent = `${count} рублей будет равно: ${converter_to_valute.toFixed(2)} ${currency}`
    }
})


const count = 100
const usdPrice = await get_usd(url);
const eurPrice = await get_eur(url);
const p_usd = document.querySelector('.usd');
const p_eur = document.querySelector('.eur');
p_usd.textContent = `Текущая цена доллара: ${usdPrice} рублей`;
p_eur.textContent = `Текущая цена евро: ${eurPrice} рублей`;
calculateCurrencySelect();
