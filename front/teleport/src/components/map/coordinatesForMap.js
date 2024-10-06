// coordinates.js
//USE https://www.gps-coordinates.net/
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
  "Bucharest": { lat: 44.4268, lon: 26.1025 },
  "Barcelona": { lat: 41.3851, lon: 2.1734 },
  "Amsterdam": { lat: 52.3676, lon: 4.9041 },
  "Rome": { lat: 41.9028, lon: 12.4964 },
  "Prague": { lat: 50.0755, lon: 14.4378 },
  "Berlin": { lat: 52.5200, lon: 13.4050 },
  "Vienna": { lat: 48.2082, lon: 16.3738 },
  "Singapore": { lat: 1.3521, lon: 103.8198 },
  "Shanghai": { lat: 31.2304, lon: 121.4737 },
  "Hong Kong": { lat: 22.3193, lon: 114.1694 },
  "Bangkok": { lat: 13.7563, lon: 100.5018 },
  "Seoul": { lat: 37.5665, lon: 126.9780 },
  "Bali": { lat: -8.3405, lon: 115.0920 },
  "San Francisco": { lat: 37.7749, lon: -122.4194 },
  "Chicago": { lat: 41.8781, lon: -87.6298 },
  "Montreal": { lat: 45.5017, lon: -73.5673 },
  "Las Vegas": { lat: 36.1699, lon: -115.1398 },
  "Toronto": { lat: 43.6532, lon: -79.3832 },
  "Buenos Aires": { lat: -34.6037, lon: -58.3816 },
  "São Paulo": { lat: -23.5505, lon: -46.6333 },
  "Medellín": { lat: 6.2476, lon: -75.5658 },
  "Bogotá": { lat: 4.7110, lon: -74.0721 },
  "Cape Town": { lat: -33.9249, lon: 18.4241 },
  "Marrakech": { lat: 31.6295, lon: -7.9811 },
  "Nairobi": { lat: -1.2921, lon: 36.8219 },
  "Johannesburg": { lat: -26.2041, lon: 28.0473 },
  "Melbourne": { lat: -37.8136, lon: 144.9631 }
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