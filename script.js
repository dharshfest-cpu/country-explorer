const input = document.getElementById("countryInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const details = document.getElementById("countryDetails");

async function searchCountry() {
    const searchText = input.value.trim();

    if (!searchText) {
        message.textContent = "Please enter a country name.";
        details.classList.add("hidden");
        return;
    }

    message.textContent = "Loading...";
    details.classList.add("hidden");
    searchButton.disabled = true;

    try {
        const response = await fetch(
            `https://countries.dev/name/${encodeURIComponent(searchText)}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No country found");
        }

        // Find exact country name first
        const searchLower = searchText.toLowerCase();

        let country = data.find(
            item => item.name.toLowerCase() === searchLower
        );

        // If exact match is not available,
        // choose the first result
        if (!country) {
            country = data[0];
        }

        displayCountry(country);

        message.textContent = "";
        details.classList.remove("hidden");

    } catch (error) {
        console.error(error);

        message.textContent =
            "Country not found. Please enter a valid country name.";

        details.classList.add("hidden");

    } finally {
        searchButton.disabled = false;
    }
}


function displayCountry(country) {

    document.getElementById("countryName").textContent =
        country.name || "N/A";


    // Flag
    const flagElement = document.getElementById("flag");

    if (country.flags && country.flags.svg) {
        flagElement.src = country.flags.svg;
    } else if (country.flags && country.flags.png) {
        flagElement.src = country.flags.png;
    } else if (country.flag) {
        flagElement.src = country.flag;
    }

    flagElement.alt = `${country.name} flag`;


    // Capital
    document.getElementById("capital").textContent =
        country.capital || "N/A";


    // Population
    document.getElementById("population").textContent =
        country.population
            ? country.population.toLocaleString()
            : "N/A";


    // Region
    document.getElementById("region").textContent =
        country.region || "N/A";


    // Sub Region
    document.getElementById("subregion").textContent =
        country.subregion || "N/A";


    // Currency
    if (
        Array.isArray(country.currencies) &&
        country.currencies.length > 0
    ) {

        const currencyText = country.currencies
            .map(currency => {

                if (currency.symbol) {
                    return `${currency.name} (${currency.symbol})`;
                }

                return currency.name;

            })
            .join(", ");

        document.getElementById("currency").textContent =
            currencyText;

    } else {

        document.getElementById("currency").textContent =
            "N/A";
    }


    // Languages
    if (
        Array.isArray(country.languages) &&
        country.languages.length > 0
    ) {

        const languageText = country.languages
            .map(language => language.name)
            .join(", ");

        document.getElementById("languages").textContent =
            languageText;

    } else {

        document.getElementById("languages").textContent =
            "N/A";
    }


    // Country Code
    document.getElementById("code").textContent =
        country.alpha3Code || "N/A";
}


// Search button
searchButton.addEventListener("click", searchCountry);


// Press Enter
input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchCountry();
    }

});