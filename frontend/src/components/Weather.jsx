import { useState, useEffect } from 'react';
import "../styles/Weather.scss";

const api = {
  base: process.env.REACT_APP_WEATHER_API_BASE,
  key: process.env.REACT_APP_WEATHER_API_KEY,
};

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const GetWeather = async () => {
    try {
      const response = await fetch(
        `${api.base}weather?q=ettimadai&units=metric&APPID=${api.key}`
      );
      const result = await response.json();

      if (result.cod !== 200) {
        throw new Error(result.message || "Unable to fetch weather data.");
      }

      setWeather(result);
      setError(null);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    GetWeather();
    const interval = setInterval(GetWeather, 60000); // Refresh every 1 minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="weather-container">
      {error ? (
        <p className="error-message">{error}</p>
      ) : weather ? (
        <div className="weather-box">
          <img
            src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].main}
            className="weather-icon"
          />
          <span className="temperature">{weather.main.temp}&deg;C </span>
          <span className="weather-description">{weather.weather[0].main}</span>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
}
