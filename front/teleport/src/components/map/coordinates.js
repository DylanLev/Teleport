// coordinates.js

const cityCoordinates = {
    "New York": { lat: 40.7128, lon: -74.0060 },
    "London": { lat: 51.5074, lon: -0.1278 },
    "Paris": { lat: 48.8566, lon: 2.3522 },
    "Tokyo": { lat: 35.6762, lon: 139.6503 },
    "Sydney": { lat: -33.8688, lon: 151.2093 },
    "Dubai": { lat: 25.2048, lon: 55.2708 },
    "Moscow": { lat: 55.7558, lon: 37.6173 },
    "Rio de Janeiro": { lat: -22.9068, lon: -43.1729 },
    "Cairo": { lat: 30.0444, lon: 31.2357 },
    "Mumbai": { lat: 19.0760, lon: 72.8777 },
    "Miami": { lat: 25.7617, lon: -80.1918 },
    "Cannes": { lat: 43.5528, lon: 7.0174 },
    "Tel Aviv": { lat: 32.0853, lon: 34.7818 },
    "Los Angeles": { lat: 34.0522, lon: -118.2437 },
    "Marbella": { lat: 36.5100, lon: -4.8858 },
    "Bucharest": { lat: 44.4268, lon: 26.1025 }
  };
  
  function getCityCoordinates(cityName) {
    const normalizedCityName = cityName.trim().toLowerCase();
    for (const [city, coordinates] of Object.entries(cityCoordinates)) {
      if (city.toLowerCase() === normalizedCityName) {
        return coordinates;
      }
    }
    return null; // Return null if the city is not found
  }
  
  export { getCityCoordinates };