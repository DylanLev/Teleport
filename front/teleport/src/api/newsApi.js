// newsApi.js

export const fetchNews = async (countryCode) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${countryCode}`);
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Non-JSON response from server");
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in retrieving news data:", error);
      throw error;
    }
  };