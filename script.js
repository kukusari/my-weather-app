const apiKey = '1a6cda69c04f6851e30de8f581258d5b';

// 1. เลือก DOM Elements
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const favoritesContainer = document.querySelector('#favorites-container');
const refreshBtn = document.querySelector('#refresh-btn');

// --- EVENT LISTENERS ---
// โหลดเมืองโปรดเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', loadFavoriteCities);

// จัดการการเพิ่มเมืองใหม่
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        addCityToFavorites(cityName);
        cityInput.value = '';
    }
});

// จัดการการลบเมือง
favoritesContainer.addEventListener('click', event => {
    if (event.target.classList.contains('remove-btn')) {
        const card = event.target.closest('.weather-card');
        const cityName = card.dataset.city;
        if (cityName) {
            removeCityFromFavorites(cityName);
        }
    }
});
// จัดการการ Refresh
refreshBtn.addEventListener('click', loadFavoriteCities);


// --- FUNCTIONS ---

function getFavoriteCities() {
    const citiesJSON = localStorage.getItem('favoriteCities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
}

function saveFavoriteCities(cities) {
    //localStorage.removeItem('favoriteCities', JSON.stringify(cities));
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

function loadFavoriteCities() {
    favoritesContainer.innerHTML = ''; // เคลียร์ของเก่าก่อน
    const cities = getFavoriteCities();

    cities.forEach(city => fetchAndDisplayWeather(city));
}

async function addCityToFavorites(cityName) {
    let cities = getFavoriteCities();
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        saveFavoriteCities(cities);
        loadFavoriteCities();
    } else {
        alert(`${cityName} อยู่ในรายการโปรดแล้ว`);
    }
}

function removeCityFromFavorites(cityName) {
    let cities = getFavoriteCities();
    cities = cities.filter(city => city !== cityName);
    saveFavoriteCities(cities);
    const card = favoritesContainer.querySelector(`[data-city="${cityName}"]`);
        card.remove();
        

}

async function fetchAndDisplayWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`ไม่พบข้อมูลของ ${city}`);
         

        const data = await response.json();

        const { name, main, weather } = data;
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.setAttribute('data-city', name);

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
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `<h3>${city}</h3><p class="error">${error.message}</p>`;
        favoritesContainer.appendChild(card);
    }
}