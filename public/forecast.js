let forecastChart = null;
let seasonalChart = null;

function initializeCharts() {
    const forecastCtx = document.getElementById('forecastChart').getContext('2d');
    forecastChart = new Chart(forecastCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [
                { label: 'Rainfall (mm)', data: [120, 140, 180, 200, 160, 140, 180, 220], borderColor: '#007bff', backgroundColor: 'rgba(0, 123, 255, 0.1)', yAxisID: 'y', tension: 0.4 },
                { label: 'Yield (kg/ha)', data: [1200, 1350, 1600, 1800, 1700, 1550, 1750, 1900], borderColor: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)', yAxisID: 'y1', tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'top' } },
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Rainfall (mm)' } },
                y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Yield (kg/ha)' }, grid: { drawOnChartArea: false } }
            }
        }
    });

    const seasonalCtx = document.getElementById('seasonalChart').getContext('2d');
    seasonalChart = new Chart(seasonalCtx, {
        type: 'bar',
        data: {
            labels: ['Rice', 'Wheat', 'Maize', 'Soybeans', 'Cotton'],
            datasets: [
                { label: 'Last Season', data: [1800, 2200, 1900, 1600, 1400], backgroundColor: 'rgba(76, 175, 80, 0.6)', borderColor: '#4caf50', borderWidth: 1 },
                { label: 'This Season (Predicted)', data: [1950, 2350, 2050, 1750, 1550], backgroundColor: 'rgba(255, 152, 0, 0.6)', borderColor: '#ff9800', borderWidth: 1 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Yield (kg/hectare)' } } }
        }
    });
}

function generateHeatmap() {
    const heatmap = document.getElementById('heatmap');
    heatmap.innerHTML = '';
    const colors = ['#d4edda', '#c3e6cb', '#a8e6cf', '#4caf50'];
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        const productivity = Math.random();
        let colorIndex = 0;
        if (productivity < 0.25) colorIndex = 0;
        else if (productivity < 0.5) colorIndex = 1;
        else if (productivity < 0.75) colorIndex = 2;
        else colorIndex = 3;
        cell.style.backgroundColor = colors[colorIndex];
        cell.textContent = Math.round(productivity * 100);
        heatmap.appendChild(cell);
    }
}

function updateStats() {
    const rainfall = Math.floor(Math.random() * 100) + 100;
    const temp = Math.floor(Math.random() * 10) + 20;
    const yieldChange = Math.floor(Math.random() * 20) - 5;
    const health = Math.floor(Math.random() * 20) + 80;
    document.getElementById('rainfallForecast').textContent = rainfall + 'mm';
    document.getElementById('tempForecast').textContent = temp + '°C';
    document.getElementById('yieldTrend').textContent = (yieldChange > 0 ? '+' : '') + yieldChange + '%';
    document.getElementById('cropHealth').textContent = health + '%';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    generateHeatmap();
    updateStats();
    setInterval(updateStats, 30000);
});


