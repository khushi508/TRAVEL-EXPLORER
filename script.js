// ======= DOM Elements =======
const searchButton = document.getElementById("search-button");
const destinationInput = document.getElementById("destination-input");
const resultDiv = document.getElementById("results");
const weatherDiv = document.getElementById("weather-info");
const spinner = document.getElementById("spinner");
const hoverSound = document.getElementById("hover-sound");
const speechBubble = document.getElementById("speech-bubble");

// ======= API Keys =======
const UNSPLASH_ACCESS_KEY = "dTfIjaty6q65aFDj6cmF26V6VWNtMoDCVppgXyvuDrs"; 
const WEATHER_KEY = "deb38f6066d1a3c385f09418dea6c8e4";

// ======= Play hover sound =======
document.body.addEventListener("mouseover", e => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'BUTTON') hoverSound.play();
});

// ======= Explore place function for buttons =======
function explorePlace(query) {
    destinationInput.value = query;
    searchButton.click();
}

// ======= Map tourist spots to valid OpenWeatherMap cities =======
const touristCityMap = {
    "Taj Mahal": "Agra,IN",
    "Jaipur": "Jaipur,IN",
    "Goa": "Panaji,IN", 
    "Kerala": "Kochi,IN", 
    "Leh": "Leh,IN",
    "Delhi": "Delhi,IN",
    "Mumbai": "Mumbai,IN",
    "Rishikesh": "Rishikesh,IN",
    "Udaipur": "Udaipur,IN"
};

// ======= Main search function =======
searchButton.addEventListener("click", () => {
    let query = destinationInput.value.trim();
    if (!query) return alert("Please enter a destination!");

    // Map to real city for weather fetch
    const mappedCity = touristCityMap[query] || query;

    console.log("Fetching weather for:", mappedCity); // Debug log

    // Doraemon speech
    speechBubble.textContent = `Doraemon says: Let's explore ${query}! 🐾`;

    // Show spinner & hide previous results
    spinner.classList.remove("hidden");
    resultDiv.innerHTML = "";
    weatherDiv.classList.add("hidden");

    // ======= Fetch Unsplash images =======
    fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`)
        .then(res => res.json())
        .then(data => {
            spinner.classList.add("hidden");
            if (!data.results || data.results.length === 0) {
                resultDiv.innerHTML = "<p>No images found!</p>";
                return;
            }
            resultDiv.innerHTML = data.results.map((photo, i) => `
                <div class="image-card" style="animation-delay:${i*0.1}s">
                    <img src="${photo.urls.small}" alt="${query}">
                    <div class="overlay">${photo.alt_description || query}</div>
                </div>
            `).join("");
        })
        .catch(() => {
            spinner.classList.add("hidden");
            alert("Error fetching images!");
        });

    // ======= Fetch weather info =======
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(mappedCity)}&appid=${WEATHER_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                weatherDiv.textContent = `Weather info not found for "${query}"!`;
            } else {
                weatherDiv.innerHTML = `
                    Weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C 🌡️
                `;
            }
            weatherDiv.classList.remove("hidden");
        })
        .catch(() => {
            weatherDiv.textContent = `Error fetching weather info for "${query}"`;
            weatherDiv.classList.remove("hidden");
        });
});
