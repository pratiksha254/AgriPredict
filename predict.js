function loadSavedData() {
    const savedData = localStorage.getItem('agripredict_form_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
            }
        });
    }
}

function saveFormData(formData) {
    localStorage.setItem('agripredict_form_data', JSON.stringify(formData));
}

function calculateYield(data) {
    const { rainfall, ndvi, soilCarbon, temperature } = data;
    return Math.max(0, (rainfall * 0.3) + (ndvi * 500) + (soilCarbon * 100) - (temperature * 2));
}

function getKPICategory(value, type) {
    switch(type) {
        case 'rainfall':
            if (value < 80) return { value: 'Low', color: '#dc3545' };
            if (value > 300) return { value: 'High', color: '#ffc107' };
            return { value: 'Normal', color: '#28a745' };
        case 'temperature':
            if (value < 15) return { value: 'Cold', color: '#17a2b8' };
            if (value > 30) return { value: 'Hot', color: '#dc3545' };
            return { value: 'Optimal', color: '#28a745' };
        case 'soil':
            if (value < 3) return { value: 'Poor', color: '#dc3545' };
            if (value > 6) return { value: 'Excellent', color: '#28a745' };
            return { value: 'Good', color: '#ffc107' };
        case 'ndvi':
            if (value < 0.3) return { value: 'Poor', color: '#dc3545' };
            if (value > 0.7) return { value: 'Excellent', color: '#28a745' };
            return { value: 'Healthy', color: '#28a745' };
        default:
            return { value: 'Normal', color: '#6c757d' };
    }
}

function initializeCharts() {
    const yieldCtx = document.getElementById('yieldTrendChart').getContext('2d');
    new Chart(yieldCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Historical Yield',
                data: [1200, 1350, 1100, 1400, 1600, 1550],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }, {
                label: 'Predicted Yield',
                data: [null, null, null, null, null, 1800],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Yield (kg/hectare)' } } }
        }
    });

    const factorCtx = document.getElementById('factorImpactChart').getContext('2d');
    new Chart(factorCtx, {
        type: 'doughnut',
        data: {
            labels: ['Rainfall', 'NDVI', 'Soil Carbon', 'Temperature'],
            datasets: [{ data: [30, 25, 20, 25], backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'] }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

function updateDashboardStats(yield) {
    document.getElementById('predictedYield').textContent = Math.round(yield);
    const ndvi = parseFloat(document.getElementById('ndvi').value) || 0.5;
    const health = Math.round(ndvi * 100);
    document.getElementById('cropHealth').textContent = health + '%';
    const temp = parseFloat(document.getElementById('temperature').value) || 25;
    const rainfall = parseFloat(document.getElementById('rainfall').value) || 150;
    let risk = 'Low';
    if (temp > 35 || rainfall > 300 || rainfall < 50) risk = 'High';
    else if (temp > 30 || rainfall > 200 || rainfall < 80) risk = 'Medium';
    document.getElementById('weatherRisk').textContent = risk;
}

document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        region: document.getElementById('region').value,
        crop: document.getElementById('crop').value,
        rainfall: parseFloat(document.getElementById('rainfall').value),
        temperature: parseFloat(document.getElementById('temperature').value),
        humidity: parseFloat(document.getElementById('humidity').value),
        soilCarbon: parseFloat(document.getElementById('soilCarbon').value),
        soilPh: parseFloat(document.getElementById('soilPh').value),
        ndvi: parseFloat(document.getElementById('ndvi').value)
    };
    const yieldVal = calculateYield(formData);
    document.getElementById('yieldResult').textContent = Math.round(yieldVal);
    const rainfallKPI = getKPICategory(formData.rainfall, 'rainfall');
    const tempKPI = getKPICategory(formData.temperature, 'temperature');
    const soilKPI = getKPICategory(formData.soilCarbon, 'soil');
    const ndviKPI = getKPICategory(formData.ndvi, 'ndvi');
    document.getElementById('rainfallKPI').textContent = rainfallKPI.value;
    document.getElementById('tempKPI').textContent = tempKPI.value;
    document.getElementById('soilKPI').textContent = soilKPI.value;
    document.getElementById('ndviKPI').textContent = ndviKPI.value;
    document.getElementById('resultCard').style.display = 'block';
    updateDashboardStats(yieldVal);
    saveFormData(formData);
});

document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    initializeCharts();
});


