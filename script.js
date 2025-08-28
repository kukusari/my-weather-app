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
    // TODO: ภารกิจที่ 4 - เขียน Logic การลบเมือง (ใช้ Event Delegation)
    // 1. เช็คว่า element ที่ถูกคลิกมี class 'remove-btn' หรือไม่
    // 2. ถ้าใช่ ให้หาชื่อเมืองจาก parent element ที่ใกล้ที่สุด (.weather-card)
    //    คำใบ้: event.target.closest('.weather-card').dataset.city
    // 3. ถ้าได้ชื่อเมืองมาแล้ว ให้เรียกใช้ฟังก์ชัน removeCityFromFavorites(cityName)
});

// จัดการการ Refresh
refreshBtn.addEventListener('click', loadFavoriteCities);


// --- FUNCTIONS ---

function getFavoriteCities() {
    // TODO: ภารกิจที่ 1.1 - เขียนฟังก์ชันเพื่อดึงรายชื่อเมืองจาก localStorage
    // คำใบ้: ใช้ localStorage.getItem('favoriteCities') และ JSON.parse()
    // ถ้าไม่มีข้อมูล ให้ return array ว่าง []
    const citiesJSON = localStorage.getItem('favoriteCities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
}

function saveFavoriteCities(cities) {
    // TODO: ภารกิจที่ 1.2 - เขียนฟังก์ชันเพื่อบันทึกรายชื่อเมืองลง localStorage
    // คำใบ้: ใช้ localStorage.setItem('favoriteCities', ...) และ JSON.stringify()
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

function loadFavoriteCities() {
    favoritesContainer.innerHTML = ''; // เคลียร์ของเก่าก่อน
    const cities = getFavoriteCities();
    // TODO: ภารกิจที่ 2 - วนลูปรายชื่อเมือง (cities) แล้วเรียกใช้ฟังก์ชัน fetchAndDisplayWeather() สำหรับแต่ละเมือง
    // คำใบ้: cities.forEach(city => fetchAndDisplayWeather(city));
}

async function addCityToFavorites(cityName) {
    // TODO: ภารกิจที่ 3 - เขียนฟังก์ชันสำหรับเพิ่มเมืองใหม่
    // 1. ดึงรายชื่อเมืองปัจจุบันมา
    // 2. ตรวจสอบว่าเมืองนี้ถูกเพิ่มไปแล้วหรือยัง (เพื่อป้องกันการซ้ำ)
    // 3. ถ้ายังไม่มี ให้เพิ่มเมืองใหม่เข้าไปใน array
    // 4. บันทึก array ใหม่ลง localStorage
    // 5. เรียกใช้ loadFavoriteCities() เพื่อแสดงผลใหม่ทั้งหมด
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
    // TODO: ภารกิจที่ 4.1 - เขียน Logic ส่วนนี้
    // 1. ดึงรายชื่อเมืองปัจจุบันมา
    // 2. ใช้ .filter() เพื่อสร้าง array ใหม่ที่ไม่มีเมืองที่ต้องการลบ
    // 3. บันทึก array ใหม่ลง localStorage
    // 4. เรียกใช้ loadFavoriteCities() เพื่อแสดงผลใหม่ทั้งหมด
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
