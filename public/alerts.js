let riskDistributionChart = null;
let alertTrendsChart = null;


function generateAlerts() {
    const savedData = localStorage.getItem('agripredict_form_data');
    let alerts = [];

    if (savedData) {
        const data = JSON.parse(savedData);
        alerts = generateAlertsFromData(data);
    } else {
        alerts = generateMockAlerts();
    }

    displayAlerts(alerts);
    updateRiskSummary(alerts);
}

function generateAlertsFromData(data) {
    const alerts = [];

    if (data.rainfall < 80) {
        alerts.push({
            type: 'critical',
            title: 'Drought Risk Detected',
            description: `Rainfall is critically low (${data.rainfall}mm). Consider irrigation systems and drought-resistant crops.`,
            time: '2 hours ago',
            severity: 'critical'
        });
    } else if (data.rainfall > 300) {
        alerts.push({
            type: 'warning',
            title: 'Flood Risk Warning',
            description: `Heavy rainfall detected (${data.rainfall}mm). Monitor drainage systems and prepare for potential flooding.`,
            time: '1 hour ago',
            severity: 'warning'
        });
    }

    if (data.temperature > 34 && data.humidity > 65) {
        alerts.push({
            type: 'warning',
            title: 'Pest Infestation Risk',
            description: `High temperature (${data.temperature}°C) and humidity (${data.humidity}%) create ideal conditions for pest growth.`,
            time: '3 hours ago',
            severity: 'warning'
        });
    } else if (data.temperature > 40) {
        alerts.push({
            type: 'critical',
            title: 'Extreme Heat Warning',
            description: `Temperature is extremely high (${data.temperature}°C). Crops may suffer heat stress.`,
            time: '30 minutes ago',
            severity: 'critical'
        });
    }

    if (data.soilCarbon < 2) {
        alerts.push({
            type: 'warning',
            title: 'Low Soil Fertility',
            description: `Soil organic carbon is low (${data.soilCarbon}%). Consider soil amendments and organic fertilizers.`,
            time: '4 hours ago',
            severity: 'warning'
        });
    }

    if (data.ndvi < 0.3) {
        alerts.push({
            type: 'critical',
            title: 'Poor Crop Health',
            description: `NDVI indicates poor vegetation health (${data.ndvi}). Check for diseases or nutrient deficiencies.`,
            time: '1 hour ago',
            severity: 'critical'
        });
    }

    return alerts;
}

function generateMockAlerts() {
    return [
        { type: 'critical', title: 'Drought Risk Detected', description: 'Rainfall is critically low (45mm). Consider irrigation systems and drought-resistant crops.', time: '2 hours ago', severity: 'critical' },
        { type: 'warning', title: 'Pest Infestation Risk', description: 'High temperature (36°C) and humidity (70%) create ideal conditions for pest growth.', time: '3 hours ago', severity: 'warning' },
        { type: 'critical', title: 'Poor Crop Health', description: 'NDVI indicates poor vegetation health (0.25). Check for diseases or nutrient deficiencies.', time: '1 hour ago', severity: 'critical' },
        { type: 'warning', title: 'Low Soil Fertility', description: 'Soil organic carbon is low (1.8%). Consider soil amendments and organic fertilizers.', time: '4 hours ago', severity: 'warning' },
        { type: 'info', title: 'Optimal Growing Conditions', description: 'Current weather conditions are optimal for crop growth. Monitor for any changes.', time: '6 hours ago', severity: 'info' }
    ];
}

function displayAlerts(alerts) {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';

    alerts.forEach(alert => {
        const alertCard = document.createElement('div');
        alertCard.className = `alert-card ${alert.type}`;
        alertCard.innerHTML = `
            <div class="alert-header">
                <div class="alert-icon ${alert.type}">
                    <i class="fas ${getAlertIcon(alert.type)}"></i>
                </div>
                <div class="alert-title">${alert.title}</div>
            </div>
            <div class="alert-description">${alert.description}</div>
            <div class="alert-meta">
                <div class="alert-time">
                    <i class="fas fa-clock"></i>
                    ${alert.time}
                </div>
                <div class="alert-severity ${alert.severity}">${alert.severity}</div>
            </div>
        `;
        container.appendChild(alertCard);
    });
}

function getAlertIcon(type) {
    switch(type) {
        case 'critical': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
    }
}

function updateRiskSummary(alerts) {
    const critical = alerts.filter(a => a.type === 'critical').length;
    const warning = alerts.filter(a => a.type === 'warning').length;
    const safe = alerts.filter(a => a.type === 'info').length;

    document.getElementById('criticalCount').textContent = critical;
    document.getElementById('warningCount').textContent = warning;
    document.getElementById('safeCount').textContent = safe;
}

function initializeCharts() {
    const riskCtx = document.getElementById('riskDistributionChart').getContext('2d');
    riskDistributionChart = new Chart(riskCtx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'Warning', 'Safe'],
            datasets: [{
                data: [3, 5, 12],
                backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    const trendCtx = document.getElementById('alertTrendsChart').getContext('2d');
    alertTrendsChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Critical Alerts', data: [2, 3, 1, 4, 3, 2, 3], borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.1)', tension: 0.4 },
                { label: 'Warnings', data: [5, 4, 6, 3, 5, 4, 5], borderColor: '#ffc107', backgroundColor: 'rgba(255, 193, 7, 0.1)', tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Number of Alerts' } } }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    generateAlerts();
});


