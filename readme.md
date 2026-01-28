# 🌍 Global Explorer Dashboard

A dynamic, interactive dashboard that provides real-time data for countries worldwide. Built with modern JavaScript, it integrates multiple APIs to deliver weather, currency, and sun-time information in a sleek, user-friendly interface.

## ✨ Key Features

- 🌐 **Country Discovery:** Explore detailed info about any country (Capital, Population, Area, Calling Code, etc.).
- 🌤️ **Smart Weather:** Real-time weather with humidity, UV index, sunrise/sunset visualization, 24h & 7-day forecast.
- 🕒 **Live Local Time:** Real-time clock synced to selected country’s timezone.
- 📅 **Holidays & Events:** Local holidays, upcoming events, and long weekends.
- 📊 **Interactive Visuals:** Daylight progress bars, humidity charts, and more.
  performance.
- **🕒 Live Local Time:** A real-time ticking clock synced with the selected country's timezone.
- **📅 Holidays & Events:** Stay updated with local holidays and upcoming events in the selected destination.
- **📊 Interactive Progress Bars:** Visual representation of daylight distribution and humidity levels.

## 🚀 Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+).
- **Icons:** Font Awesome (SVG mode).
- **APIs Used:**
  - [RestCountries API](https://restcountries.com/) - Country data.
  - [Open-Meteo API](https://open-meteo.com/) - Geocoding.
  - [Sunrise-Sunset API](https://sunrise-sunset.org/api) - Sun times.
  - [ExchangeRate-API](https://www.exchangerate-api.com/) - Currency data.
  - [OpenWeatherMap](https://openweathermap.org/) - Weather data.

## 🛠️ Performance Optimization

One of the highlights of this project is the **Intelligent Caching System**. To prevent the `429 Too Many Requests` error and stay within API rate limits, the dashboard caches exchange rates in the browser's `localStorage` for 1 hour. This ensures:

- Faster load times for recurring users.
- Minimal API calls.
- Smooth user experience even if the API limit is temporarily reached.

## 📸 Screenshots

_(Add your screenshots here after hosting)_

## 🔗 Live Demo

---

Made with Fares for a better travel experience.
