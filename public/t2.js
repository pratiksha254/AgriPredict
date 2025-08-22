const API_KEY = "YOUR_API_KEY_HERE";
let lastPolygon = null, currentPolygonId = null;

const map = L.map('map').setView([18.5204, 73.8567], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
const drawControl = new L.Control.Draw({ edit: { featureGroup: drawnItems }, draw: { polygon: { allowIntersection: false, showArea: true }, marker:false, rectangle:false, circle:false, polyline:false } });
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, e => {
  drawnItems.clearLayers();
  drawnItems.addLayer(e.layer);
  lastPolygon = e.layer.toGeoJSON();
  document.getElementById("output").textContent = "✅ Polygon drawn. Click Save.";
});

async function savePolygon() {
  if (!lastPolygon) { alert("Draw a polygon first!"); return; }
  const body = { name: "My Field", geo_json: lastPolygon };
  const res = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`, { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(body) });
  const data = await res.json();
  currentPolygonId = data.id;
  document.getElementById("output").textContent = "✅ Polygon saved! ID: " + currentPolygonId;
  loadDashboardData();
}

async function listPolygons() {
  const res = await fetch(`https://api.agromonitoring.com/agro/1.0/polygons?appid=${API_KEY}`);
  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

async function fetchJSON(url) { const res = await fetch(url); return res.json(); }

async function loadDashboardData() {
  const now = Math.floor(Date.now()/1000), weekAgo = now - 7*86400;
  const imgList = await fetchJSON(`https://api.agromonitoring.com/agro/1.0/image/search?start=${weekAgo}&end=${now}&polyid=${currentPolygonId}&appid=${API_KEY}`);
  if (imgList.length) document.querySelector("#satImage img").src = imgList[0].image.ndvi;
  const ndviVals = imgList.map(d => ({ date: new Date(d.dt*1000).toLocaleDateString(), val: d.stats.ndvi.mean }));
  new Chart(document.getElementById('ndviChart'), { type: 'line', data: { labels: ndviVals.map(v=>v.date), datasets:[{ label:'NDVI', data: ndviVals.map(v=>v.val), borderColor:'#2e7d32', fill:false }] } });
  const soil = await fetchJSON(`https://api.agromonitoring.com/agro/1.0/soil?polyid=${currentPolygonId}&appid=${API_KEY}`);
  document.getElementById("soilTable").innerHTML = `
    <tr><td>Date</td><td>${new Date(soil.dt*1000).toLocaleString()}</td></tr>
    <tr><td>Top Temp (t0)</td><td>${soil.t0.toFixed(2)} K</td></tr>
    <tr><td>10cm Temp (t10)</td><td>${soil.t10.toFixed(2)} K</td></tr>
    <tr><td>Moisture</td><td>${(soil.moisture*100).toFixed(1)}%</td></tr>`;
  new Chart(document.getElementById('soilMoistureChart'), { type:'doughnut', data:{ labels:['Moisture','Dry'], datasets:[{ data:[soil.moisture*100, 100-(soil.moisture*100)], backgroundColor:['#42a5f5','#eee'] }] }, options:{ plugins:{ legend:{ display:false } } } });
  const lat = lastPolygon.geometry.coordinates[0][0][1];
  const lon = lastPolygon.geometry.coordinates[0][0][0];
  const precip = await fetchJSON(`https://api.agromonitoring.com/agro/1.0/weather/history/accumulated_precipitation?lat=${lat}&lon=${lon}&start=${weekAgo}&end=${now}&appid=${API_KEY}`);
  const precipVals = precip.map(d => ({ date: new Date(d.dt*1000).toLocaleDateString(), val: d.precipitation }));
  new Chart(document.getElementById('precipChart'), { type:'bar', data:{ labels:precipVals.map(v=>v.date), datasets:[{ label:'Precipitation (mm)', data:precipVals.map(v=>v.val), backgroundColor:'#42a5f5' }] } });
}


