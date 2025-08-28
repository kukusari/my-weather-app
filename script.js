const apiKey = '1a6cda69c04f6851e30de8f581258d5b';

// 1. เลือก DOM Elements
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const favoritesContainer = document.querySelector('#favorites-container');
const refreshBtn = document.querySelector('#refresh-btn');

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', loadFavoriteCities);
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        addCityToFavorites(cityName);
        cityInput.value = '';
    }
});
favoritesContainer.addEventListener('click', event => {
    if (event.target.classList.contains('remove-btn')) {
        const card = event.target.closest('.weather-card');
        const cityName = card.dataset.city;
        if (cityName) {
            removeCityFromFavorites(cityName);
        }
    }
});
refreshBtn.addEventListener('click', loadFavoriteCities);

// --- FUNCTIONS ---
function getFavoriteCities() {
    const citiesJSON = localStorage.getItem('favoriteCities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
}

function saveFavoriteCities(cities) {
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

function loadFavoriteCities() {
    favoritesContainer.innerHTML = ''; // ล้าง DOM ก่อนโหลดใหม่
    const cities = getFavoriteCities();
    cities.forEach(city => fetchAndDisplayWeather(city));
}

async function addCityToFavorites(cityName) {
    let cities = getFavoriteCities();
    
    // ดึงข้อมูลจาก API เพื่อตรวจสอบชื่อเมืองที่ถูกต้อง
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=th`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`ไม่พบข้อมูลของ ${cityName}`);
        
        const data = await response.json();
        const apiCityName = data.name; // ใช้ชื่อเมืองที่ได้จาก API
        
        // ตรวจสอบว่าเมืองอยู่ใน favorites หรือไม่ (case-insensitive)
        if (!cities.some(city => city.toLowerCase() === apiCityName.toLowerCase())) {
            cities.push(apiCityName); // เพิ่มชื่อเมืองจาก API
            saveFavoriteCities(cities);
            await fetchAndDisplayWeather(apiCityName);
        } else {
            alert(`${apiCityName} อยู่ในรายการโปรดแล้ว`);
        }
    } catch (error) {
        console.error(error);
        alert(`ไม่สามารถเพิ่ม ${cityName} ได้: ${error.message}`);
    }
}

function removeCityFromFavorites(cityName) {
    let cities = getFavoriteCities();
    // กรองเมืองออกจาก array โดยใช้ case-insensitive
    cities = cities.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    // บันทึก array ใหม่ลง localStorage
    saveFavoriteCities(cities);

    // ลบการ์ดออกจาก DOM
    const card = favoritesContainer.querySelector(`[data-city="${cityName}"]`);
    if (card) {
        card.remove();
    }
}

async function fetchAndDisplayWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`ไม่พบข้อมูลของ ${city}`);

        const data = await response.json();
        const { name, main, weather } = data;

        // ตรวจสอบว่าเมืองนี้อยู่ใน favorites หรือไม่
        const cities = getFavoriteCities();
        if (!cities.some(city => city.toLowerCase() === name.toLowerCase())) {
            return;
        }

        // ตรวจสอบว่ามี card อยู่แล้วหรือไม่
        if (favoritesContainer.querySelector(`[data-city="${name}"]`)) return;

        const card = document.createElement('div');
        card.className = 'weather-card';
        card.setAttribute('data-city', name); // ใช้ชื่อเมืองจาก API

        card.innerHTML = `
            <div>
                <h3>${name}</h3>
                <p>${weather[0].description}</p>
            </div>
            <div class="text-right">
                <p class="temp">${main.temp.toFixed(1)}°C</p>
            </div>
            <button class="remove-btn">X</button>
        `;

        favoritesContainer.appendChild(card);

    } catch (error) {
        console.error(error);
        // แสดงการ์ดข้อผิดพลาดเฉพาะเมื่อเมืองอยู่ใน favorites
        const cities = getFavoriteCities();
        if (cities.some(city => city.toLowerCase() === city.toLowerCase())) {
            const card = document.createElement('div');
            card.className = 'weather-card';
            card.setAttribute('data-city', city);
            card.innerHTML = `<h3>${city}</h3><p class="error">${error.message}</p><button class="remove-btn">X</button>`;
            favoritesContainer.appendChild(card);
        }
    }
}