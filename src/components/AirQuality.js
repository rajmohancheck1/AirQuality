// src/components/AirQuality.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './AirQuality.css'; // Import the CSS file for styling

const UNSPLASH_ACCESS_KEY = 'ZD_0fEh9HC-xzxWKOSNMTBpnsgKr_mpl34IuUdU3XSk'; // Replace with your Unsplash Access Key

const AirQuality = () => {
  const [city, setCity] = useState('');
  const [airQuality, setAirQuality] = useState(null);
  const [cityPhotos, setCityPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgroundPhoto, setBackgroundPhoto] = useState(null); // State to store the background photo

  useEffect(() => {
    // Apply the background image to the body when the photo is available
    if (backgroundPhoto) {
      document.body.style.backgroundImage = `url(${backgroundPhoto})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed'; // Make background fixed
      document.body.style.backgroundRepeat = 'no-repeat'; // Ensure it doesn't repeat
    } else {
      document.body.style.backgroundImage = '';
    }
  }, [backgroundPhoto]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch Air Quality Data
      const airQualityResponse = await axios.get(
        `https://api.api-ninjas.com/v1/airquality?city=${city}`,
        {
          headers: { 'X-Api-Key': 'EEnad4F66O5ar0pW1tLBpQ==RfJKwyDEPdmRI5fg' }, // Replace with your actual API key
        }
      );
      setAirQuality(airQualityResponse.data);

      // Fetch City Photos from Unsplash
      const photosResponse = await axios.get(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      setCityPhotos(photosResponse.data.results);

      // Set the first photo as the background image for the body
      if (photosResponse.data.results.length > 0) {
        setBackgroundPhoto(photosResponse.data.results[0].urls.full); // Choose first image
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!airQuality) return null;

    const pieData = {
      labels: ['CO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10'],
      datasets: [
        {
          label: 'Concentration in µg/m³',
          data: [
            airQuality.CO.concentration,
            airQuality.NO2.concentration,
            airQuality.O3.concentration,
            airQuality.SO2.concentration,
            airQuality['PM2.5'].concentration,
            airQuality.PM10.concentration,
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
          ],
          borderWidth: 1,
        },
      ],
    };

    const barData = {
      labels: ['CO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10'],
      datasets: [
        {
          label: 'AQI Value',
          data: [
            airQuality.CO.aqi,
            airQuality.NO2.aqi,
            airQuality.O3.aqi,
            airQuality.SO2.aqi,
            airQuality['PM2.5'].aqi,
            airQuality.PM10.aqi,
          ],
          backgroundColor: '#36A2EB',
          borderColor: '#007BFF',
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="charts-container">
        <div className="chart">
          <h4>Pollutant Concentrations (µg/m³)</h4>
          <Pie data={pieData} />
        </div>
        <div className="chart">
          <h4>Air Quality Index (AQI)</h4>
          <Bar data={barData} />
        </div>
      </div>
    );
  };

  const renderPhotos = () => {
    return (
      <div className="city-photos-container">
        <h4>Photos of {city}</h4>
        <div className="city-photos">
          {cityPhotos.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.alt_description}
              className="city-photo"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="air-quality-container">
      <h2>Search Air Quality in a City</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {airQuality && (
        <div className="air-quality-details">
          <h3>Air Quality in {city}</h3>
          <p>Overall AQI: {airQuality.overall_aqi}</p>
          <ul>
            <li>CO: {airQuality.CO.concentration} µg/m³ (AQI: {airQuality.CO.aqi})</li>
            <li>NO2: {airQuality.NO2.concentration} µg/m³ (AQI: {airQuality.NO2.aqi})</li>
            <li>O3: {airQuality.O3.concentration} µg/m³ (AQI: {airQuality.O3.aqi})</li>
            <li>SO2: {airQuality.SO2.concentration} µg/m³ (AQI: {airQuality.SO2.aqi})</li>
            <li>PM2.5: {airQuality['PM2.5'].concentration} µg/m³ (AQI: {airQuality['PM2.5'].aqi})</li>
            <li>PM10: {airQuality.PM10.concentration} µg/m³ (AQI: {airQuality.PM10.aqi})</li>
          </ul>
          {renderCharts()}
          {renderPhotos()}
        </div>
      )}
    </div>
  );
};

export default AirQuality;
