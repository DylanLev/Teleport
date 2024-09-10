const API_BASE_URL = 'https://de1.api.radio-browser.info/json/stations/bycountry/';

export const fetchRadioStation = async (country) => {
  try {
    // Change country code to 'uk' if it's 'gb' (United Kingdom)
    const countryCode = country.toLowerCase() === 'gb' ? 'uk' : country;

    const response = await fetch(`${API_BASE_URL}${countryCode}?limit=1&order=random&genre=rock`);
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0];
    } else {
      console.error("No radio station found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching radio station:", error);
    return null;
  }
}