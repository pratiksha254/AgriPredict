# 🌱 AgriPredict - Smart Crop Yield Forecasting Platform

A comprehensive web-based agricultural intelligence platform that combines AI-powered predictions, real-time weather monitoring, soil analysis, and satellite imagery to help farmers make data-driven decisions for optimal crop yields.

## 🚀 Features

### 🎯 Core Functionality

#### 1. **AI-Powered Yield Prediction**
- **Smart Crop Yield Forecasting**: Efficient machine learning algorithms to analyze multiple data sources
- **Multi-Crop Support**: Predict yields for rice, wheat, maize, and other major crops
- **Real-time Dashboard**: Interactive charts and visualizations for yield predictions using ChartJs
- **Historical Data Analysis**: Track performance trends over time

#### 2. **Weather Intelligence System**
- **Current Weather Monitoring**: Real-time weather data for any location
- **5-Day Weather Forecast**: Detailed meteorological predictions
- **Agricultural Insights**: Weather-based farming recommendations
- **Temperature & Rainfall Trends**: Interactive charts for weather pattern analysis
- **Humidity & Wind Monitoring**: Comprehensive weather metrics

#### 3. **Soil Analysis & Monitoring**
- **SoilGrids API Integration**: Access to global soil data
- **Soil Property Analysis**: pH, organic carbon, nitrogen, phosphorus levels
- **Soil Moisture Tracking**: Real-time moisture content monitoring
- **Depth-based Analysis**: Soil data at different depths (0-5cm, 5-15cm, etc.)
- **Geographic Soil Mapping**: Location-based soil quality assessment

#### 4. **Satellite & NDVI Monitoring**
- **AgroMonitoring API Integration**: Satellite imagery and field monitoring
- **NDVI (Normalized Difference Vegetation Index)**: Crop health assessment
- **Field Boundary Mapping**: Interactive polygon drawing for field definition
- **Vegetation Health Tracking**: Real-time crop health monitoring
- **Satellite Image Analysis**: High-resolution field imagery

#### 5. **Risk Management & Alerts**
- **Smart Alert System**: Real-time agricultural risk notifications
- **Drought Risk Assessment**: Early warning for water scarcity
- **Pest Infestation Alerts**: Timely pest management notifications
- **Weather Hazard Warnings**: Extreme weather event alerts
- **Crop Disease Monitoring**: Disease outbreak predictions

#### 6. **Forecast Analysis Dashboard**
- **Comprehensive Forecasting**: 30-day weather and yield predictions
- **Rainfall Probability**: Precipitation forecasting for irrigation planning
- **Temperature Trends**: Seasonal temperature pattern analysis
- **Agricultural Calendar**: Optimal planting and harvesting recommendations

### 🛠 Technical Features

#### **Frontend Technologies**
- **Responsive Design**: Mobile-friendly interface for all devices
- **Interactive Charts**: Chart.js integration for data visualization
- **3D Model Viewer**: Spline viewer for 3D model integration
- **Interactive Maps**: Leaflet.js with drawing capabilities
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

#### **Backend Infrastructure**
- **Node.js Express Server**: Robust backend API
- **API Proxy Services**: Secure external API integration
- **Environment Configuration**: Secure API key management
- **Static File Serving**: Efficient web asset delivery

#### **Data Integration**
- **OpenWeatherMap API**: Weather and forecast data
- **SoilGrids API**: Global soil property data
- **AgroMonitoring API**: Satellite imagery and field data
- **Local Storage**: Client-side data persistence




### 🔧 Installation & Setup

#### **Prerequisites**
- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser

#### **Quick Start**
```bash
# Clone the repository
git clone https://github.com/ishwariiic/AgriPredict.git
cd AgriPredict

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start the server
npm start
```

#### **Environment Variables**
Create a `.env` file with the following variables:
```env
PORT=3000
OPENWEATHER_API_KEY=your_openweather_api_key
SOILGRIDS_API_KEY=your_soilgrids_api_key
AGROMONITORING_API_KEY=your_agromonitoring_api_key
```

### 🌐 API Endpoints

#### **Weather APIs**
- `GET /api/weather?q={city}` - Current weather data
- `GET /api/forecast?q={city}` - 5-day weather forecast

#### **Soil APIs**
- `GET /api/soil?lat={lat}&lon={lon}&property={property}&depth={depth}` - Soil data

#### **Health Check**
- `GET /api/health` - Backend health status

### 📱 User Experience

#### **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Cross-browser compatibility

#### **Data Visualization**
- Interactive charts and graphs
- Real-time data updates
- Color-coded risk indicators
- Intuitive navigation

#### **Performance**
- Fast loading times
- Optimized asset delivery
- Efficient API calls
- Local data caching

### 🔒 Security Features

- **API Key Protection**: Server-side API key management
- **Input Validation**: Secure form handling
- **CORS Configuration**: Cross-origin request security
- **Environment Variables**: Secure configuration management

### 🚀 Deployment

#### **Local Development**
```bash
npm run dev  # Development mode with nodemon
```

#### **Production**
```bash
npm start    # Production server
```





**AgriPredict** - Empowering farmers with AI-driven insights for sustainable agriculture and optimal crop yields. 🌾✨


