// Globel
const selectedDestination = document.querySelector(".selected-destination");
const countryDropdown = document.getElementById("global-country");
const dashboardCountryInfo = document.querySelector(".dashboard-country-info");
const placeHolder = document.querySelector(".country-info-placeholder");
let cityData = {};
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const cityDropdown = document.getElementById("global-city");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingText = document.getElementById("loading-text");
let savedPlans = JSON.parse(localStorage.getItem("mySavedPlans")) || [];
const statSaved = document.getElementById("stat-saved");
statSaved.textContent = savedPlans.length;
let liveClockInterval;

selectedDestination.classList.add("d-none");
dashboardCountryInfo.classList.add("d-none");
// loading spinner
function showLoading(message) {
  if (loadingOverlay) {
    loadingText.textContent = message;
    loadingOverlay.classList.remove("hidden");
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add("hidden");
    loadingOverlay.style.display = "none";
  }
}

function updateHeaderDateTime() {
  const dateTimeElement = document.getElementById("current-datetime");
  const now = new Date();

  const formattedDate = now.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  dateTimeElement.textContent = `${formattedDate}, ${formattedTime}`;
}

setInterval(updateHeaderDateTime, 1000);

async function fetchCountries() {
  try {
    const res = await fetch("https://date.nager.at/api/v3/AvailableCountries");
    const countries = await res.json();
    return countries;
  } catch (err) {
    console.error("Error fetching countries:", err);
  }
}

async function populateDropdown() {
  const countries = await fetchCountries();

  countries.sort((a, b) => a.name.localeCompare(b.name));

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.countryCode;
    option.textContent = country.name;
    countryDropdown.appendChild(option);
  });
}

populateDropdown();

async function getCapital(countryCode) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`,
    );
    const data = await res.json();
    return data[0].capital[0];
  } catch (err) {
    console.error("Error fetching capital:", err);
    return null;
  }
}

countryDropdown.addEventListener("change", async function () {
  const selectedCode = countryDropdown.value;

  cityDropdown.innerHTML = '<option value="">Select City</option>';

  if (selectedCode) {
    const cities = cityData[selectedCode];

    if (cities) {
      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.name;
        option.textContent = city.name;
        cityDropdown.appendChild(option);
      });
    } else {
      const capitalName = await getCapital(selectedCode);
      cityDropdown.innerHTML = '<option value="">Select City</option>';

      if (capitalName) {
        const option = document.createElement("option");
        option.value = capitalName;
        option.textContent = `${capitalName} (Capital)`;
        option.selected = true;
        cityDropdown.appendChild(option);
      } else {
        const option = document.createElement("option");
        option.textContent = "No data available";
        cityDropdown.appendChild(option);
      }
    }
  }
});

// explore btn

document
  .getElementById("global-search-btn")
  .addEventListener("click", async () => {
    // handel dashboard display
    selectedDestination.classList.remove("d-none");
    dashboardCountryInfo.classList.remove("d-none");
    placeHolder.classList.add("d-none");

    // DOM Elements
    const countryCode = countryDropdown.value;

    const selectedCountryFlag = document.getElementById(
      "selected-country-flag",
    );

    const dashBoredFlag = document.querySelector(".dashboard-country-flag");
    const selectedCountryName = document.querySelector(
      ".selected-country-name",
    );

    const dashboardCountryTitle = document.querySelector(
      ".dashboard-country-title h3",
    );

    const officialNameElement = document.querySelector(".official-name");

    const cityName = cityDropdown.value;

    const selectedCityName = document.querySelector(".selected-city-name");

    const regionElement = document.querySelector(".region");

    const capitalElement = document.querySelector(".capital-value");

    const populationElement = document.querySelector(".population-value");

    const area = document.querySelector(".area-value");

    const continent = document.querySelector(".continent-value");

    const callingCode = document.querySelector(".calling-value");

    const driveSide = document.querySelector(".drive-value");

    const weak = document.querySelector(".weak-value");

    const currencyElement = document.querySelector(".extra-tag.currency");

    const languageElement = document.querySelector(".language-value");

    const neighborsContainer = document.querySelector(".neighbors-value");

    const mapLink = document.querySelector(".dashboard-country-actions a");

    neighborsContainer.innerHTML = "";

    const localTimeValue = document.getElementById("country-local-time");

    const localTimeZone = document.querySelector(".local-time-zone");

    let clockInterval;
    const year = document.getElementById("global-year").value;

    if (countryCode) {
      const lowerCode = countryCode.toLowerCase();

      selectedCountryFlag.src = `https://flagcdn.com/w80/${lowerCode}.png`;
      dashBoredFlag.src = `https://flagcdn.com/w80/${lowerCode}.png`;

      selectedCountryName.innerHTML =
        countryDropdown.options[countryDropdown.selectedIndex].text;

      dashboardCountryTitle.innerHTML =
        countryDropdown.options[countryDropdown.selectedIndex].text;

      selectedCityName.textContent = cityName;
      showLoading("Fetching destination data...");
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`,
        );
        const data = await res.json();
        const country = data[0];
        const timezoneStr = country.timezones[0];
        const fullOfficialName = country.name.official;
        const region = country.region || "Europe";
        const subregion = country.subregion || "Northern Europe";
        const capital = country.capital ? country.capital[0] : "Mariehamn";
        const population = country.population;
        const areaValue = country.area;
        const idd = country.idd;
        const drive = country.car.side;
        const startOfWeek = country.startOfWeek;
        const currencyKey = country.currencies
          ? Object.keys(country.currencies)[0]
          : "EUR";
        const currency = data[0].currencies[currencyKey];
        const languages = Object.values(data[0].languages).join(", ");
        const neighbors = country.borders || [];
        const googleMapsUrl = country.maps.googleMaps;
        const countryName =
          countryDropdown.options[countryDropdown.selectedIndex].text;

        // set data in dom

        officialNameElement.textContent = fullOfficialName;

        capitalElement.textContent = capital;

        populationElement.textContent = population.toLocaleString();

        area.textContent = `${areaValue.toLocaleString()} km²`;

        continent.textContent = region;

        const fullCallingCode = idd.root + idd.suffixes[0];
        callingCode.textContent = fullCallingCode;

        driveSide.textContent = drive.charAt(0).toUpperCase() + drive.slice(1);

        weak.textContent =
          startOfWeek.charAt(0).toUpperCase() + startOfWeek.slice(1);

        const currencyText = `${currency.name} (${currencyKey} ${currency.symbol})`;

        currencyElement.textContent = currencyText;

        languageElement.textContent = languages;

        mapLink.href = googleMapsUrl;
        mapLink.target = "_blank";
        fetchAndDisplayEvents(countryCode, cityName);
        neighbors.forEach((borderCode) => {
          const span = document.createElement("span");
          span.className = "extra-tag border-tag";
          span.textContent = borderCode;

          neighborsContainer.appendChild(span);
        });
        fetchAndDisplayHolidays(countryCode, year, countryName);
        fetchAndDisplayWeather(cityName);
        updateLWHeader(countryName, countryCode, year);
        fetchLongWeekends(countryCode, year);
        startLiveClock(timezoneStr);
        if (cityName) {
          sunTimes(countryName, countryCode, cityName);
        }
        // sunTimes(countryName, countryCode, cityName);
        if (regionElement) {
          regionElement.textContent = `${region} • ${subregion}`;
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setTimeout(hideLoading, 500);
      }
    }
  });

function startLiveClock(timezoneStr) {
  const timeElement = document.getElementById("country-local-time");
  const zoneElement = document.querySelector(".local-time-zone");

  if (liveClockInterval) clearInterval(liveClockInterval);

  function getOffsetMinutes(tz) {
    if (!tz || tz === "UTC") return 0;
    const match = tz.match(/[+-]\d+:\d+/);
    if (!match) return 0;

    const [hours, minutes] = match[0].split(":").map(Number);
    const sign = tz.includes("-") ? -1 : 1;
    return sign * (Math.abs(hours) * 60 + minutes);
  }

  const offsetMinutes = getOffsetMinutes(timezoneStr);

  function updateTime() {
    const now = new Date();
    const utcDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const localDate = new Date(utcDate.getTime() + offsetMinutes * 60000);

    timeElement.textContent = localDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    zoneElement.textContent = timezoneStr;
  }

  updateTime();
  liveClockInterval = setInterval(updateTime, 1000);
}

async function loadCityData() {
  try {
    const response = await fetch("./city.json");

    if (!response.ok) {
      const altResponse = await fetch("city.json");
      if (!altResponse.ok) throw new Error("Failed to load city data");
      cityData = await altResponse.json();
    } else {
      cityData = await response.json();
    }

    console.log("✅ City data loaded successfully from Root");
  } catch (error) {
    console.error("❌ Error loading city.json:", error);
  }
}

loadCityData();

// switcing views
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const targetView = item.getAttribute("data-view");

    views.forEach((view) => view.classList.remove("active"));
    navItems.forEach((nav) => nav.classList.remove("active"));

    const targetSection = document.getElementById(`${targetView}-view`);
    if (targetSection) {
      targetSection.classList.add("active");
      item.classList.add("active");
    }
  });
});

// clear selection btn

async function fetchAndDisplayHolidays(countryCode, year, countryName) {
  const holidaysContent = document.getElementById("holidays-content");
  const holidaysSelection = document.getElementById("holidays-selection");
  const holidaysHeaderDesc = document.querySelector(".holiday-head span");
  const holidayHeader = document.querySelector(".holiday-header");
  holidaysSelection.innerHTML = `
        <div class="current-selection-badge">
            <img src="https://flagcdn.com/w40/${countryCode.toLowerCase()}.png" alt="${countryName}" class="selection-flag">
            <span>${countryName}</span>
            <span class="selection-year">${year}</span>
        </div>
    `;
  holidaysHeaderDesc.textContent = `Browse public holidays for ${countryName} and plan your trips around them`;

  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
    );
    if (!response.ok) throw new Error("Failed to fetch holidays");

    const holidays = await response.json();
    const statHolidays = document.getElementById("stat-holidays");
    const cityName = cityDropdown.value;

    holidaysContent.innerHTML = "";

    if (holidays.length === 0) {
      holidaysContent.innerHTML = "<p>No holidays found for this year.</p>";
      return;
    }

    holidays.forEach((holiday, index) => {
      const date = new Date(holiday.date);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const dayName = date.toLocaleString("en-US", { weekday: "long" });

      const card = document.createElement("div");
      card.className = "holiday-card";
      card.innerHTML = `
                <div class="holiday-card-header">
                    <div class="holiday-date-box">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                    <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
                </div>
                <h3>${holiday.localName}</h3>
                <p class="holiday-name">${holiday.name}</p>
                <div class="holiday-card-footer">
                    <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ${dayName}</span>
                    <span class="holiday-type-badge">${holiday.types[0] || "Public"}</span>
                </div>
            `;

      card
        .querySelector(".holiday-action-btn")
        .addEventListener("click", () => {
          addToPlans(holiday, "holiday");
        });

      holidayHeader.innerHTML = `<p>Browse public holidays for ${countryName} and plan your trips around them</p>`;
      holidaysContent.appendChild(card);
    });
    if (statHolidays) statHolidays.textContent = holidays.length;
  } catch (error) {
    console.error("Error:", error);
    holidaysContent.innerHTML =
      "<p>Error loading holidays. Please try again.</p>";
  }
}
// Events Section

async function fetchAndDisplayEvents(countryCode, cityName) {
  const eventsContent = document.getElementById("events-content");
  const eventsHeaderDesc = document.querySelector(
    "#events-view .view-header-content p",
  );
  const eventsSelection = document.querySelector(
    "#events-view .view-header-selection",
  );
  const eventHeader = document.querySelector(".event-header p");

  const countryName =
    countryDropdown.options[countryDropdown.selectedIndex].text;
  eventsHeaderDesc.textContent = `Discover concerts, sports, theatre and more in ${cityName}`;
  eventsSelection.innerHTML = `
    <div class="current-selection-badge">
      <img src="https://flagcdn.com/w40/${countryCode.toLowerCase()}.png" alt="${countryName}" class="selection-flag">
      <span>${countryName}</span>
      <span class="selection-city">• ${cityName}</span>
    </div>
  `;

  const cacheKey = `events_${countryCode}_${cityName}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    console.log(
      `%c [Cache Hit] Loading events for ${cityName} from storage`,
      "color: #2ecc71; font-weight: bold;",
    );
    const events = JSON.parse(cachedData);
    renderEventsToUI(events, cityName, eventHeader, eventsContent);
    return;
  }

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=59SGfPiIEOuKZnViHIcPtob1bG3A2dsi&city=${cityName}&countryCode=${countryCode}&size=20`,
    );

    if (response.status === 429) {
      eventsContent.innerHTML = `<p class="error" style="text-align:center; padding:20px;">Ticketmaster is temporarily busy (Too many requests). Please try again in a minute.</p>`;
      return;
    }

    const data = await response.json();

    if (data._embedded && data._embedded.events) {
      localStorage.setItem(cacheKey, JSON.stringify(data._embedded.events));

      renderEventsToUI(
        data._embedded.events,
        cityName,
        eventHeader,
        eventsContent,
      );
    } else {
      eventsContent.innerHTML = `
        <div class="no-events-placeholder">
          <div class="placeholder-icon"><i class="fa-solid fa-ticket"></i></div>
          <h2 class="placeholder-title">No Events Found</h2>
          <p class="placeholder-subtitle">No events found for ${cityName} at this time.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsContent.innerHTML =
      "<p>Error loading events. Please try again later.</p>";
  }
}

function renderEventsToUI(events, cityName, eventHeader, eventsContent) {
  eventsContent.innerHTML = "";
  eventHeader.innerHTML = `<p>Discover concerts, sports, theatre and more in ${cityName}</p>`;

  events.forEach((event) => {
    const image =
      event.images.find((img) => img.width > 500)?.url || event.images[0].url;
    const category = event.classifications
      ? event.classifications[0].segment.name
      : "Event";
    const venue = event._embedded.venues
      ? event._embedded.venues[0].name
      : "Venue TBA";

    const eventDate = new Date(event.dates.start.localDate).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      },
    );
    const eventTime = event.dates.start.localTime
      ? event.dates.start.localTime.substring(0, 5)
      : "TBA";

    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <div class="event-card">
        <div class="event-card-image">
          <img src="${image}" alt="${event.name}">
          <span class="event-card-category">${category}</span>
          <button class="event-card-save btn-save-logic"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="event-card-body">
          <h3>${event.name}</h3>
          <div class="event-card-info">
            <div><i class="fa-regular fa-calendar"></i> ${eventDate} at ${eventTime}</div>
            <div><i class="fa-solid fa-location-dot"></i> ${venue}, ${cityName}</div>
          </div>
          <div class="event-card-footer">
            <button class="btn-event btn-save-logic"><i class="fa-regular fa-heart"></i> Save</button>
            <a href="${event.url}" target="_blank" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
          </div>
        </div>
      </div>
    `;

    cardContainer.querySelectorAll(".btn-save-logic").forEach((btn) => {
      btn.addEventListener("click", () => {
        addToPlans(
          {
            localName: event.name,
            name: venue,
            date: event.dates.start.localDate,
            url: event.url,
          },
          "event",
        );
      });
    });

    eventsContent.appendChild(cardContainer.firstElementChild);
  });
}

// Weather

async function fetchAndDisplayWeather(cityName, capitalName) {
  const weatherContent = document.getElementById("weather-content");
  const locationToSearch = cityName || capitalName;

  if (!locationToSearch || !weatherContent) return;

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationToSearch)}&count=1&language=en&format=json`,
    );
    const geoData = await geoRes.json();
    if (!geoData.results) throw new Error("Location not found");

    const { latitude, longitude, name } = geoData.results[0];

    weatherContent.innerHTML = `
      <div class="weather-hero-card">
        <div class="weather-hero-bg"></div>
        <div class="weather-hero-content">
          <div class="weather-location">
            <i class="fa-solid fa-location-dot"></i>
            <span class="weather-city">--</span>
            <span class="weather-time">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          </div>
          <div class="weather-hero-main">
            <div class="weather-hero-left">
              <div class="weather-hero-icon">
                <i class=""></i>
              </div>
              <div class="weather-hero-temp">
                <span class="temp-value">--</span>
                <span class="temp-unit">°C</span>
              </div>
            </div>
            <div class="weather-hero-right">
              <div class="weather-condition">Loading...</div>
              <div class="weather-feels">Feels like --°C</div>
              <div class="weather-high-low">
                <span class="high">--</span>
                <span class="low">--</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="weather-details-grid">
        <div class="weather-detail-card">
          <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
          <div class="detail-info">
            <span class="detail-label">Humidity</span>
            <span class="detail-value humidity-value">--%</span>
          </div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
          <div class="detail-info">
            <span class="detail-label">Wind Speed</span>
            <span class="detail-value wind-value">-- km/h</span>
          </div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
          <div class="detail-info">
            <span class="detail-label">UV Index</span>
            <span class="detail-value uv-value">--</span>
          </div>
        </div>
        <div class="weather-detail-card">
          <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
          <div class="detail-info">
            <span class="detail-label">Precipitation</span>
            <span class="detail-value precipitation-value">--%</span>
          </div>
        </div>
      </div>

      <div class="hourly-forecast-section">
        <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
        <div class="hourly-scroll"></div>
      </div>

      <div class="weather-section">
        <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
        <div class="forecast-list"></div>
      </div>
    `;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto`,
    );
    const data = await weatherRes.json();

    updateWeatherUI(data, name, cityName);
  } catch (error) {
    console.error("Weather Error:", error);
    weatherContent.innerHTML = `<div class="error-state">City not found.</div>`;
  }
}

function getWeatherStatus(code) {
  const statusMap = {
    0: { label: "Clear Sky", icon: "fa-sun" },
    1: { label: "Mainly Clear", icon: "fa-cloud-sun" },
    2: { label: "Partly Cloudy", icon: "fa-cloud-sun" },
    3: { label: "Overcast", icon: "fa-cloud" },
    45: { label: "Foggy", icon: "fa-smog" },
    48: { label: "Depositing Rime Fog", icon: "fa-smog" },
    51: { label: "Light Drizzle", icon: "fa-cloud-rain" },
    53: { label: "Moderate Drizzle", icon: "fa-cloud-rain" },
    55: { label: "Dense Drizzle", icon: "fa-cloud-rain" },
    56: { label: "Light Freezing Drizzle", icon: "fa-snowflake" },
    57: { label: "Dense Freezing Drizzle", icon: "fa-snowflake" },
    61: { label: "Slight Rain", icon: "fa-cloud-rain" },
    63: { label: "Moderate Rain", icon: "fa-cloud-showers-heavy" },
    65: { label: "Heavy Rain", icon: "fa-cloud-showers-heavy" },
    66: { label: "Light Freezing Rain", icon: "fa-snowflake" },
    67: { label: "Heavy Freezing Rain", icon: "fa-snowflake" },
    71: { label: "Slight Snow Fall", icon: "fa-snowflake" },
    73: { label: "Moderate Snow Fall", icon: "fa-snowflake" },
    75: { label: "Heavy Snow Fall", icon: "fa-snowflake" },
    77: { label: "Snow Grains", icon: "fa-snowflake" },
    80: { label: "Slight Rain Showers", icon: "fa-cloud-rain" },
    81: { label: "Moderate Rain Showers", icon: "fa-cloud-showers-heavy" },
    82: { label: "Violent Rain Showers", icon: "fa-cloud-showers-heavy" },
    85: { label: "Slight Snow Showers", icon: "fa-snowflake" },
    86: { label: "Heavy Snow Showers", icon: "fa-snowflake" },
    95: { label: "Thunderstorm", icon: "fa-cloud-bolt" },
    96: { label: "Thunderstorm with Hail", icon: "fa-cloud-bolt" },
    99: { label: "Thunderstorm with Heavy Hail", icon: "fa-cloud-bolt" },
  };
  return statusMap[code] || { label: "Unknown", icon: "fa-cloud" };
}

function updateWeatherUI(data, name, cityName) {
  if (window.FontAwesome) {
    window.FontAwesome.dom.i2svg();
  }
  const elements = {
    city: document.querySelector(".weather-city"),
    temp: document.querySelector(".temp-value"),
    icon: document.querySelector(".weather-hero-icon i"),
    desc: document.querySelector(".weather-condition"),
    feels: document.querySelector(".weather-feels"),
    high: document.querySelector(".high"),
    low: document.querySelector(".low"),
    humidity: document.querySelector(".humidity-value"),
    wind: document.querySelector(".wind-value"),
    uv: document.querySelector(".uv-value"),
    precip: document.querySelector(".precipitation-value"),
    heroCard: document.querySelector(".weather-hero-card"),
  };

  if (!elements.city || !elements.temp) return;

  const status = getWeatherStatus(data.current.weather_code);

  elements.city.textContent = cityName || name;
  elements.temp.textContent = Math.round(data.current.temperature_2m);
  elements.desc.textContent = status.label;
  elements.feels.textContent = `Feels like ${Math.round(data.current.apparent_temperature)}°C`;
  elements.high.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${Math.round(data.daily.temperature_2m_max[0])}°`;
  elements.low.innerHTML = `<i class="fa-solid fa-arrow-down"></i> ${Math.round(data.daily.temperature_2m_min[0])}°`;
  elements.humidity.textContent = `${data.current.relative_humidity_2m}%`;
  elements.wind.textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
  elements.uv.textContent = Math.round(data.daily.uv_index_max[0]);
  elements.precip.textContent = `${data.daily.precipitation_probability_max[0]}%`;

  elements.heroCard.className = "weather-hero-card";
  const label = status.label.toLowerCase();
  if (label.includes("rain") || label.includes("drizzle")) {
    elements.heroCard.classList.add("weather-rainy");
    elements.icon.className = "fa-solid fa-cloud-showers-heavy ";
  } else if (label.includes("clear")) {
    elements.heroCard.classList.add("weather-sunny");
    elements.icon.className = "fa-solid fa-sun ";
  } else if (label.includes("cloud") || label.includes("overcast")) {
    elements.heroCard.classList.add("weather-cloudy");
    elements.icon.className = "fa-solid fa-cloud ";
  } else if (label.includes("storm")) {
    elements.heroCard.classList.add("weather-stormy");
    elements.icon.className = "fa-solid fa-bolt ";
  }

  updateHourlyForecast(data);
  updateDailyForecast(data);
}

function updateHourlyForecast(data) {
  const hourlyContainer = document.querySelector(".hourly-scroll");
  if (!hourlyContainer) return;

  hourlyContainer.innerHTML = "";
  const currentHour = new Date().getHours();

  for (let i = currentHour; i < currentHour + 24; i++) {
    if (!data.hourly.time[i]) break;
    const time = new Date(data.hourly.time[i]);
    const status = getWeatherStatus(data.hourly.weather_code[i]);
    const hourlyItem = document.createElement("div");
    hourlyItem.className = `hourly-item ${i === currentHour ? "now" : ""}`;
    hourlyItem.innerHTML = `
      <span class="hourly-time">${i === currentHour ? "Now" : time.toLocaleTimeString([], { hour: "numeric" })}</span>
      <div class="hourly-icon"><i class="fa-solid ${status.icon}"></i></div>
      <span class="hourly-temp">${Math.round(data.hourly.temperature_2m[i])}°</span>
    `;
    hourlyContainer.appendChild(hourlyItem);
  }
}

function updateDailyForecast(data) {
  const forecastList = document.querySelector(".forecast-list");
  if (!forecastList || !data.daily) return;

  forecastList.innerHTML = "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  data.daily.time.forEach((dateString, i) => {
    const date = new Date(dateString);
    const status = getWeatherStatus(data.daily.weather_code[i]);
    const forecastDay = document.createElement("div");
    forecastDay.className = `forecast-day ${i === 0 ? "today" : ""}`;
    forecastDay.innerHTML = `
      <div class="forecast-day-name">
        <span class="day-label">${i === 0 ? "Today" : days[date.getDay()]}</span>
        <span class="day-date">${date.toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span>
      </div>
      <div class="forecast-icon"><i class="fa-solid ${status.icon}"></i></div>
      <div class="forecast-temps">
        <span class="temp-max">${Math.round(data.daily.temperature_2m_max[i])}°</span>
        <span class="temp-min">${Math.round(data.daily.temperature_2m_min[i])}°</span>
      </div>
      <div class="forecast-precip">
        <i class="fa-solid fa-droplet"></i>
        <span>${data.daily.precipitation_probability_max[i]}%</span>
      </div>
    `;
    forecastList.appendChild(forecastDay);
  });
}
// Long Weekends

async function fetchLongWeekends(countryCode, year = 2026) {
  const lwContainer = document.getElementById("lw-content");
  if (!lwContainer) return;

  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/LongWeekend/${year}/${countryCode}`,
    );
    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    displayLongWeekends(data);
  } catch (error) {
    console.error("Error:", error);
    lwContainer.innerHTML =
      '<p class="error">Could not find long weekends for this country.</p>';
  }
}
function displayLongWeekends(weekends) {
  const lwContainer = document.getElementById("lw-content");
  lwContainer.innerHTML = "";

  if (weekends.length === 0) {
    lwContainer.innerHTML = "<p>No long weekends found for this year.</p>";
    return;
  }

  weekends.forEach((lw, index) => {
    const startDate = new Date(lw.startDate);
    const endDate = new Date(lw.endDate);
    const options = { month: "short", day: "numeric" };
    const dateRange = `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}, ${startDate.getFullYear()}`;

    const card = document.createElement("div");
    card.className = "lw-card";

    const infoBoxClass = lw.needBridgeDay ? "warning" : "success";
    const infoBoxIcon = lw.needBridgeDay ? "fa-info-circle" : "fa-check-circle";
    const infoBoxText = lw.needBridgeDay
      ? "Requires taking a bridge day off"
      : "No extra days off needed!";

    card.innerHTML = `
      <div class="lw-card-header">
        <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${lw.dayCount} Days</span>
        <button class="holiday-action-btn"><i class="fa-regular fa-heart"></i></button>
      </div>
      <h3>Long Weekend #${index + 1}</h3>
      <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${dateRange}</div>
      <div class="lw-info-box ${infoBoxClass}">
        <i class="fa-solid ${infoBoxIcon}"></i> ${infoBoxText}
      </div>
      <div class="lw-days-visual">
        ${generateDaysVisual(startDate, lw.dayCount)}
      </div>
    `;

    card.querySelector(".holiday-action-btn").addEventListener("click", () => {
      addToPlans(
        {
          localName: "Long Weekend",
          name: `${lw.dayCount} Days Holiday`,
          date: lw.startDate,
        },
        "longweekend",
      );
    });

    lwContainer.appendChild(card);
  });
}

function generateDaysVisual(start, count) {
  let html = "";
  let current = new Date(start);
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < count; i++) {
    const dayName = daysShort[current.getDay()];
    const isWeekend = current.getDay() === 5 || current.getDay() === 6;

    html += `
      <div class="lw-day ${isWeekend ? "weekend" : ""}">
        <span class="name">${dayName}</span>
        <span class="num">${current.getDate()}</span>
      </div>
    `;
    current.setDate(current.getDate() + 1);
  }
  return html;
}

function updateLWHeader(countryName, countryCode, year) {
  const flagImg = document.querySelector(".selection-flag");
  const countrySpan = document.querySelector(".view-header-selection span");
  const yearSpan = document.querySelector(".selection-year");

  if (flagImg)
    flagImg.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  if (countrySpan) countrySpan.textContent = countryName;
  if (yearSpan) yearSpan.textContent = year;
}

// sun times

async function sunTimes(cityName) {
  const sunContent = document.getElementById("sun-times-content");
  if (!sunContent || !cityName) return;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`,
    );
    const geoData = await geoRes.json();
    if (!geoData.results) throw new Error("Location not found");
    const { latitude, longitude } = geoData.results[0];

    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`,
    );
    const data = await response.json();
    const results = data.results;

    const formatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formatTime = (isoStr) =>
      new Date(isoStr).toLocaleTimeString([], formatOptions);

    const daySeconds = results.day_length;
    const dayHours = Math.floor(daySeconds / 3600);
    const dayMins = Math.floor((daySeconds % 3600) / 60);
    const dayPercent = ((daySeconds / 86400) * 100).toFixed(1);
    const darkSeconds = 86400 - daySeconds;
    const darkHours = Math.floor(darkSeconds / 3600);
    const darkMins = Math.floor((darkSeconds % 3600) / 60);

    sunContent.className = "sun-times-layout";
    sunContent.innerHTML = `
      <div class="sun-main-card">
        <div class="sun-main-header">
          <div class="sun-location">
            <h2><i class="fa-solid fa-location-dot"></i> ${cityName}</h2>
            <p>Sun times for your selected location</p>
          </div>
          <div class="sun-date-display">
            <div class="date">${dateStr}</div>
            <div class="day">${dayName}</div>
          </div>
        </div>
        
        <div class="sun-times-grid">
          <div class="sun-time-card dawn">
            <div class="icon"><i class="fa-solid fa-moon"></i></div>
            <div class="label">Dawn</div>
            <div class="time">${formatTime(results.civil_twilight_begin)}</div>
            <div class="sub-label">Civil Twilight</div>
          </div>
          
          <div class="sun-time-card sunrise">
            <div class="icon"><i class="fa-solid fa-sun"></i></div>
            <div class="label">Sunrise</div>
            <div class="time">${formatTime(results.sunrise)}</div>
            <div class="sub-label">Golden Hour Start</div>
          </div>
          
          <div class="sun-time-card noon">
            <div class="icon"><i class="fa-solid fa-sun-bright"></i></div>
            <div class="label">Solar Noon</div>
            <div class="time">${formatTime(results.solar_noon)}</div>
            <div class="sub-label">Sun at Highest</div>
          </div>
          
          <div class="sun-time-card sunset">
            <div class="icon"><i class="fa-solid fa-sun"></i></div>
            <div class="label">Sunset</div>
            <div class="time">${formatTime(results.sunset)}</div>
            <div class="sub-label">Golden Hour End</div>
          </div>
          
          <div class="sun-time-card dusk">
            <div class="icon"><i class="fa-solid fa-moon"></i></div>
            <div class="label">Dusk</div>
            <div class="time">${formatTime(results.civil_twilight_end)}</div>
            <div class="sub-label">Civil Twilight</div>
          </div>
          
          <div class="sun-time-card daylight">
            <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
            <div class="label">Day Length</div>
            <div class="time">${dayHours}h ${dayMins}m</div>
            <div class="sub-label">Total Daylight</div>
          </div>
        </div>
      </div>
      
      <div class="day-length-card">
        <h3><i class="fa-solid fa-chart-pie"></i> Daylight Distribution</h3>
        <div class="day-progress">
          <div class="day-progress-bar">
            <div class="day-progress-fill" style="width: ${dayPercent}%"></div>
          </div>
        </div>
        <div class="day-length-stats">
          <div class="day-stat">
            <div class="value">${dayHours}h ${dayMins}m</div>
            <div class="label">Daylight</div>
          </div>
          <div class="day-stat">
            <div class="value">${dayPercent}%</div>
            <div class="label">of 24 Hours</div>
          </div>
          <div class="day-stat">
            <div class="value">${darkHours}h ${darkMins}m</div>
            <div class="label">Darkness</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("SunTimes Error:", error);
    sunContent.innerHTML = `<p class="error">Unable to calculate sun times for ${cityName}</p>`;
  }
}

// Plan handling

function addToPlans(item, type) {
  const exists = savedPlans.some(
    (p) =>
      p.date === item.date && p.localName === (item.localName || item.name),
  );

  if (!exists) {
    savedPlans.push({ ...item, type: type });
    localStorage.setItem("mySavedPlans", JSON.stringify(savedPlans));
    renderPlans();
    if (typeof updateCounts === "function") updateCounts();
  }
}

function renderPlans() {
  const plansContent = document.getElementById("plans-content");
  const planCounter = document.getElementById("plans-count");
  const statSaved = document.getElementById("stat-saved");

  const fHolidayCount = document.getElementById("filter-holiday-count");
  const fEventCount = document.getElementById("filter-event-count");
  const fAllCount = document.getElementById("filter-all-count");
  const fLwCount = document.getElementById("filter-lw-count");

  const total = savedPlans.length;

  if (!plansContent) return;

  updateGlobalCounters();

  if (fAllCount) fAllCount.textContent = total;
  if (statSaved) {
    statSaved.textContent = total;
  }

  if (planCounter) {
    planCounter.textContent = total;
    total > 0
      ? planCounter.classList.remove("hidden")
      : planCounter.classList.add("hidden");
  }

  const hCount = savedPlans.filter((p) => p.type === "holiday").length;
  const eCount = savedPlans.filter((p) => p.type === "event").length;
  const lwCount = savedPlans.filter((p) => p.type === "longweekend").length;

  if (fAllCount) fAllCount.textContent = total;
  if (fHolidayCount) fHolidayCount.textContent = hCount;
  if (fEventCount) fEventCount.textContent = eCount;
  if (fLwCount) fLwCount.textContent = lwCount;

  if (total > 0) {
    planCounter?.classList.remove("hidden");
  } else {
    planCounter?.classList.add("hidden");
    plansContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>
        <h3>No Saved Plans Yet</h3>
        <p>Start exploring and save holidays or events!</p>
      </div>`;
    return;
  }

  plansContent.innerHTML = "";

  savedPlans.forEach((plan, index) => {
    const isEvent = plan.type === "event";
    const isLongWeekend = plan.type === "longweekend";

    const planCard = document.createElement("div");
    planCard.className = "holiday-card";

    let typeClass = "holiday";
    let typeLabel = "HOLIDAY";
    let infoIcon = "fa-circle-info";

    if (isEvent) {
      typeClass = "event";
      typeLabel = "EVENT";
      infoIcon = "fa-location-dot";
    } else if (isLongWeekend) {
      typeClass = "longweekend";
      typeLabel = "LONG WEEKEND";
      infoIcon = "fa-calendar-check";
    }

    planCard.innerHTML = `
      <div class="plan-card-content">
        <div class="plan-card-type ${typeClass}">${typeLabel}</div>
        <h3 class="plan-title">${plan.localName || plan.name}</h3>
        <div class="plan-card-details">
          <div class="plan-info-item">
            <i class="fa-regular fa-calendar"></i>
            <span>${new Date(plan.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <div class="plan-info-item">
            <i class="fa-solid ${infoIcon}"></i>
            <span>${plan.name}</span>
          </div>
        </div>
        <div class="plan-card-actions">
          <button class="btn-plan-remove"><i class="fa-solid fa-trash"></i> Remove</button>
        </div>
      </div>`;

    planCard
      .querySelector(".btn-plan-remove")
      .addEventListener("click", () => removePlan(index));
    plansContent.appendChild(planCard);
  });
}

function removePlan(index) {
  Swal.fire({
    title: "Remove Plan?",
    text: "Are you sure you want to remove this item from your plans?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, remove it!",
    cancelButtonText: "Keep it",
  }).then((result) => {
    if (result.isConfirmed) {
      savedPlans.splice(index, 1);
      localStorage.setItem("mySavedPlans", JSON.stringify(savedPlans));

      renderPlans();
      if (typeof updateCounts === "function") updateCounts();

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Removed successfully",
      });
    }
  });
}

// Clear all Plans
document.getElementById("clear-all-plans-btn").addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete all your saved plans!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, clear all!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      savedPlans = [];

      localStorage.removeItem("mySavedPlans");

      renderPlans();

      if (typeof updateCounts === "function") updateCounts();

      Swal.fire({
        title: "Cleared!",
        text: "All your plans have been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
});
function updateGlobalCounters() {
  const total = savedPlans.length;

  const statSaved = document.getElementById("stat-saved");
  if (statSaved) {
    statSaved.textContent = total;
  }

  const planCounterBadge = document.getElementById("plans-count");
  if (planCounterBadge) {
    planCounterBadge.textContent = total;
    total > 0
      ? planCounterBadge.classList.remove("hidden")
      : planCounterBadge.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderPlans();
  if (typeof updateCounts === "function") updateCounts();
});
