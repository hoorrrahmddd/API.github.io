// **المفتاح الحقيقي موجود هنا**
const API_KEY = "9c72ce77293a4a88acd125939250811"; 
const DEFAULT_CITY = "Cairo"; // المدينة الافتراضية للتحميل الأولي

// جلب العناصر من HTML
const cityInputEl = document.getElementById('city-input');
const findButton = document.getElementById('find-button');
const currentCityEl = document.getElementById('current-city');
const conditionTextEl = document.getElementById('condition-text');
const forecastContainer = document.getElementById('forecast-container');
const currentDayEl = document.getElementById('current-day');
const currentDateEl = document.getElementById('current-date');
const currentTempEl = document.getElementById('current-temp');
const currentIconEl = document.getElementById('current-icon');
const humidityValEl = document.getElementById('humidity-val');
const windValEl = document.getElementById('wind-val');
const windDirValEl = document.getElementById('wind-dir-val');

function formatDate(dateString) {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayMonth = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    return { dayName, dayMonth };
}

async function fetchWeatherData(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=en`; 

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        displayCurrentWeather(data);
        displayForecast(data);
    } catch (error) {
        console.error("error", error);
        currentCityEl.textContent = `Failed to load data for ${city}`;
        conditionTextEl.textContent = "Check city name or internet connection.";
        forecastContainer.innerHTML = '';
    }
}

function displayCurrentWeather(data) {
    const current = data.current;
    const location = data.location;
    const { dayName, dayMonth } = formatDate(location.localtime);

    currentDayEl.textContent = dayName;
    currentDateEl.textContent = dayMonth;
    currentCityEl.textContent = location.name;
    currentTempEl.textContent = `${Math.round(current.temp_c)}°C`;
    currentIconEl.src = current.condition.icon;
    currentIconEl.alt = current.condition.text;
    conditionTextEl.textContent = current.condition.text;
    humidityValEl.textContent = `${current.humidity}%`;
    windValEl.textContent = `${current.wind_kph}km/h`;
    windDirValEl.textContent = current.wind_dir;
}
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    const forecastDays = data.forecast.forecastday.slice(1); // الأيام القادمة بدون اليوم الحالي

    forecastDays.forEach(day => {
        const { dayName, dayMonth } = formatDate(day.date);

        // إنشاء كارت الطقس
        const card = document.createElement('div');
        card.className = 'col-lg-6 col-md-6 col-12 p-3 forecast-card';

        card.innerHTML = `
            <div class=" card bg-transparent text-white h-100 p-3 d-flex flex-column justify-content-between">
                
               
                <div class="text-center mb-3">
                    <span class="fs-5 fw-bold">${dayName}</span>
                    <p class="text-white-50 mb-0">${dayMonth}</p>
                </div>

            
                <div class="text-center">
                    <img src="https:${day.day.condition.icon}" 
                         alt="${day.day.condition.text}" 
                         style="width: 64px; height: 64px;">
                    <h5 class="text-white mt-2 mb-1">${day.day.condition.text}</h5>
                </div>

                <!-- درجات الحرارة -->
                <div class="text-center mt-3">
                    <p class="text-white fs-4 fw-bold mb-1">${Math.round(day.day.maxtemp_c)}°C</p>
                    <p class="text-white-50 mb-0">${Math.round(day.day.mintemp_c)}°C</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(card);
    });
}



// تشغيل البحث عند الضغط على الزرار
findButton.addEventListener('click', () => {
    const city = cityInputEl.value.trim();
    if (city) fetchWeatherData(city);
});

// 🔥 الجديد هنا 🔥
// تشغيل البحث تلقائي أثناء الكتابة
let typingTimer;
cityInputEl.addEventListener('input', () => {
    clearTimeout(typingTimer); // نمنع البحث عن كل حرف بسرعة
    const city = cityInputEl.value.trim();
    if (city.length > 1) {
        typingTimer = setTimeout(() => {
            fetchWeatherData(city);
        }, 600); // يعمل بعد نص ثانية من توقف الكتابة
    }
});

// تحميل البيانات أول ما الصفحة تفتح
fetchWeatherData(DEFAULT_CITY);
