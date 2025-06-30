const apiKey = "6146a9f6ba05a990a922473c40f9c107";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.createElement("div");
errorDiv.className = "error-msg";
document.querySelector(".card").appendChild(errorDiv);

async function checkWeather(city) {
    try {
        showLoading();
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        console.log(data);

        // Update dynamic content
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".Humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".Wind").innerHTML = data.wind.speed + " km/h";

        // Icon and theme
        const weatherCondition = data.weather[0].main.toLowerCase();
        const iconCode = data.weather[0].icon; // for day/night icon choice

        if (weatherCondition.includes("clear")) {
            weatherIcon.src = iconCode.includes("d") ? "sunny_icon.png" : "night_clear_icon.png";
        } else if (weatherCondition.includes("cloud")) {
            weatherIcon.src = "cloud_icon.png";
        } else if (weatherCondition.includes("rain")) {
            weatherIcon.src = "Rain_icon1.png";
        } else if (weatherCondition.includes("snow")) {
            weatherIcon.src = "snow_icon.png";
        } else if (weatherCondition.includes("thunderstorm") || weatherCondition.includes("hail")) {
            weatherIcon.src = "Hailstorm.png";
        } else if (weatherCondition.includes("mist") || weatherCondition.includes("haze")) {
            weatherIcon.src = "Humidity_icon.png";
        } else if (weatherCondition.includes("smoke") || weatherCondition.includes("heat")) {
            weatherIcon.src = "Heatwaves_icon.png";
        } else if (weatherCondition.includes("wind")) {
            weatherIcon.src = "Wind_icon.png";
        } else {
            weatherIcon.src = "Weather_icon.jpg";
        }

        weatherDiv.style.display = "block";
        errorDiv.innerHTML = ""; // clear any previous error
        hideLoading();

    } catch (error) {
        hideLoading();
        errorDiv.innerHTML = `<p>${error.message}</p>`;
        weatherDiv.style.display = "none";
    }
}

function showLoading() {
    weatherIcon.src = "loading.gif"; // Add this loading spinner image to your project
}

function hideLoading() {
    // Do nothing; actual weather icon will replace loading spinner
}

// Click event
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) checkWeather(city);
});

// Enter key support
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = searchBox.value.trim();
        if (city) checkWeather(city);
    }
});

// Auto geolocation fetch
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
            showLoading();
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`);
            const data = await response.json();
            checkWeather(data.name); // trigger by city name
        } catch {
            hideLoading();
            errorDiv.innerHTML = `<p>Could not fetch location weather.</p>`;
        }
    });
}
