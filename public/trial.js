document.getElementById('soilForm').addEventListener('submit', function(e) {
    e.preventDefault();
    getSoilData();
});

async function getSoilData() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    if (!latitude || !longitude) { showError('Please enter both latitude and longitude'); return; }
    showLoading(true);
    hideError();
    hideResults();
    try {
        const soilProperties = [
            { code: 'phh2o', name: 'pH (Water)', unit: '', factor: 10 },
            { code: 'soc', name: 'Organic Carbon', unit: 'g/kg', factor: 10 },
            { code: 'sand', name: 'Sand Content', unit: '%', factor: 10 },
            { code: 'clay', name: 'Clay Content', unit: '%', factor: 10 },
            { code: 'nitrogen', name: 'Total Nitrogen', unit: 'g/kg', factor: 100 },
            { code: 'cec', name: 'CEC', unit: 'cmol/kg', factor: 10 }
        ];
        const soilData = {};
        for (const property of soilProperties) {
            try {
                const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}&property=${property.code}&depth=0-5cm&value=mean`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.properties && data.properties.layers && data.properties.layers.length > 0) {
                        const layer = data.properties.layers[0];
                        if (layer.depths && layer.depths.length > 0) {
                            const rawValue = layer.depths[0].values.mean;
                            if (rawValue !== null) {
                                soilData[property.name] = { value: (rawValue / property.factor).toFixed(2), unit: property.unit };
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`Failed to fetch ${property.name}:`, error);
            }
        }
        displayResults(soilData, latitude, longitude);
    } catch (error) {
        showError('Failed to fetch soil data. Please check your coordinates and try again.');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

function displayResults(soilData, lat, lng) {
    const resultsDiv = document.getElementById('results');
    let html = `<h3>Soil Properties for Location: ${lat}, ${lng}</h3>`;
    html += '<div style="margin-top: 15px;">';
    if (Object.keys(soilData).length === 0) {
        html += '<p>No soil data available for this location.</p>';
    } else {
        for (const [propertyName, data] of Object.entries(soilData)) {
            html += `<div class="soil-property"><span class="property-name">${propertyName}:</span><span class="property-value">${data.value} ${data.unit}</span></div>`;
        }
    }
    html += '</div>';
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
}

function showLoading(show) { document.getElementById('loading').style.display = show ? 'block' : 'none'; document.querySelector('button').disabled = show; }
function showError(message) { const errorDiv = document.getElementById('error'); errorDiv.textContent = message; errorDiv.style.display = 'block'; }
function hideError() { document.getElementById('error').style.display = 'none'; }
function hideResults() { document.getElementById('results').style.display = 'none'; }


