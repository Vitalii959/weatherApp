import { apiKey } from "./main.js";

export async function getSuggestionCityList() {
  const cityList = "./js/city.list.json";

  const response = await fetch(cityList);
  if (!response.ok) {
    throw new Error("Could not fetch sugestion cities");
  }

  return await response.json();
}

export async function getWeatherData(lon, lat, type) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}
