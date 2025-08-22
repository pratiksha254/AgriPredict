const API_KEY = '42d7d4f5ef0ebb53179ab9de4c33bdad';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
let temperatureChart = null;
let rainfallChart = null;

async function getWeather() {
  const location = document.getElementById('locationInput').value;
  if (!location) { showError('Please enter a location'); return; }
  try {
    const currentWeather = await fetchCurrentWeather(location);
    displayCurrentWeather(currentWeather);
    const forecast = await fetchForecast(location);
    displayForecast(forecast);
    generateInsights(currentWeather, forecast);
    updateCharts(forecast);
  } catch (error) {
    console.error('Error:', error);
    showError('Failed to fetch weather data. Please check the location and try again.');
  }
}

async function fetchCurrentWeather(location) {
  const response = await fetch(`${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric`);
  if (!response.ok) throw new Error('Failed to fetch current weather');
  return await response.json();
}

async function fetchForecast(location) {
  const response = await fetch(`${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`);
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return await response.json();
}

function displayCurrentWeather(data) {
  document.getElementById('currentWeather').style.display = 'block';
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weatherDescription').textContent = data.weather[0].description;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
  document.getElementById('forecastSection').style.display = 'block';
  const forecastGrid = document.getElementById('forecastGrid');
  forecastGrid.innerHTML = '';
  const dailyForecast = groupForecastByDay(data.list);
  dailyForecast.forEach(day => {
    const date = new Date(day.dt * 1000);
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      <div class="forecast-icon"><img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather"></div>
      <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
      <div class="forecast-desc">${day.weather[0].description}</div>
      <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
        <div>Humidity: ${day.main.humidity}%</div>
        <div>Wind: ${day.wind.speed} m/s</div>
      </div>`;
    forecastGrid.appendChild(card);
  });
}

function groupForecastByDay(forecastList) {
  const dailyData = {};
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) dailyData[date] = item;
  });
  return Object.values(dailyData).slice(0, 5);
}

function generateInsights(currentWeather, forecast) {
  document.getElementById('insightsSection').style.display = 'block';
  const insightsGrid = document.getElementById('insightsGrid');
  insightsGrid.innerHTML = '';
  const temp = currentWeather.main.temp;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;
  const insights = [];
  if (temp < 10) { insights.push({ icon: 'fa-thermometer-empty', title: 'Cold Weather Alert', content: 'Temperatures are low. Consider cold-resistant crops or protective measures.' }); }
  else if (temp > 30) { insights.push({ icon: 'fa-thermometer-full', title: 'Heat Stress Warning', content: 'High temperatures may cause heat stress. Ensure adequate irrigation.' }); }
  else { insights.push({ icon: 'fa-thermometer-half', title: 'Optimal Temperature', content: 'Temperature conditions are favorable for most crops.' }); }
  if (humidity > 80) { insights.push({ icon: 'fa-tint', title: 'High Humidity Alert', content: 'High humidity increases disease risk. Monitor for fungal infections.' }); }
  else if (humidity < 40) { insights.push({ icon: 'fa-tint', title: 'Low Humidity Warning', content: 'Low humidity may cause water stress. Increase irrigation frequency.' }); }
  if (windSpeed > 10) { insights.push({ icon: 'fa-wind', title: 'Strong Winds', content: 'Strong winds may damage crops. Consider windbreaks.' }); }
  const hasRain = forecast.list.some(item => item.weather[0].main === 'Rain');
  if (hasRain) { insights.push({ icon: 'fa-cloud-rain', title: 'Rain Expected', content: 'Rain is forecasted. Adjust irrigation schedules.' }); }
  insights.forEach(insight => {
    const card = document.createElement('div');
    card.className = 'insight-card';
    card.innerHTML = `<div class="insight-title"><i class="fas ${insight.icon}"></i>${insight.title}</div><div class="insight-content">${insight.content}</div>`;
    insightsGrid.appendChild(card);
  });
}

function updateCharts(forecast) {
  const labels = [];
  const temperatures = [];
  const rainfallProb = [];
  forecast.list.slice(0, 8).forEach(item => {
    const date = new Date(item.dt * 1000);
    labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    temperatures.push(item.main.temp);
    rainfallProb.push(item.pop * 100);
  });
  if (temperatureChart) temperatureChart.destroy();
  const tempCtx = document.getElementById('temperatureChart').getContext('2d');
  temperatureChart = new Chart(tempCtx, { type: 'line', data: { labels, datasets: [{ label: 'Temperature (°C)', data: temperatures, borderColor: '#ff9800', backgroundColor: 'rgba(255, 152, 0, 0.1)', tension: 0.4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: false, title: { display: true, text: 'Temperature (°C)' } } } } });
  if (rainfallChart) rainfallChart.destroy();
  const rainCtx = document.getElementById('rainfallChart').getContext('2d');
  rainfallChart = new Chart(rainCtx, { type: 'bar', data: { labels, datasets: [{ label: 'Rainfall Probability (%)', data: rainfallProb, backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: '#007bff', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Probability (%)' } } } } });
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
  const locationSection = document.querySelector('.location-section');
  locationSection.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

document.addEventListener('DOMContentLoaded', function() {
  getWeather();
  document.getElementById('locationInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') getWeather(); });
});


