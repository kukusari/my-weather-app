const apiKey = "1a6cda69c04f6851e30de8f581258d5b"; // ใส่ API Key ของคุณ
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherInfoContainer = document.getElementById("weather-info-container");

// ฟังก์ชันดึงข้อมูลอากาศปัจจุบัน
async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("ไม่พบข้อมูลเมืองที่ค้นหา");

        const data = await response.json();
        displayWeather(data);

        // ดึงข้อมูลพยากรณ์ 5 วันต่อ
        getForecast(city);

    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}
// ฟังก์ชันแสดงข้อมูลอากาศปัจจุบัน
function displayWeather(data) {
    const { name, main, weather, wind } = data;

    weatherInfoContainer.innerHTML = `
        <h2>🌆 ${name}</h2>
        <p>🌡️ อุณหภูมิ: ${main.temp}°C</p>
        <p>💧 ความชื้น: ${main.humidity}%</p>
        <p>💨 ลม: ${wind.speed} m/s</p>
        <p>☁️ สภาพอากาศ: ${weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather icon">
        <h3>📅 พยากรณ์อากาศ 5 วัน</h3>
        <div id="forecast-container" class="forecast"></div>
    `;
}

// ฟังก์ชันดึงข้อมูลพยากรณ์อากาศ 5 วัน
async function getForecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("ไม่สามารถโหลดพยากรณ์อากาศได้");

        const data = await response.json();
        displayForecast(data);

    } catch (error) {
        document.getElementById("forecast-container").innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// ฟังก์ชันแสดงผลพยากรณ์อากาศ
function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";

    // ดึงข้อมูลวันละ 1 เวลา (เลือก 12:00 ของแต่ละวัน)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("th-TH", {
            weekday: "long",
            day: "numeric",
            month: "long"
        });

        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <h4>${date}</h4>
                <p>🌡️ ${day.main.temp}°C</p>
                <p>☁️ ${day.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
            </div>
        `;
    });
}

// Event เมื่อกดค้นหา
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = "";
    }
});