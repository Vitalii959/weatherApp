import { weatherSugestionList, cityNameInput, weatherCurrent } from "./main.js";
import { displayError, displaySugestionCity, displayWeather, displayForecast } from "./displayData.js";
import { sortSuggestionList, getIndexOfSelectedCity } from "./helperFunctions.js";
import { getWeatherData } from "./fetchData.js";

export let citySelected = "";
export let filteredCities = [];

export async function loadSuggestingCityList() {
  citySelected = cityNameInput.value.toLowerCase();

  if (citySelected.length >= 2) {
    try {
      filteredCities = await sortSuggestionList(citySelected);

      displaySugestionCity(filteredCities);
    } catch (error) {
      displayError(`Could not load suggestion cities list: ${error}`);
    }
  } else {
    filteredCities = [];
    weatherSugestionList.textContent = "";
  }
}

export async function loadWeatherData(lon, lat) {
  if (lon && lat) {
    try {
      const weatherData = await getWeatherData(lon, lat, "weather");
      const forecastData = await getWeatherData(lon, lat, "forecast");

      displayWeather(weatherData);
      displayForecast(forecastData);
    } catch (error) {
      displayError(error);
    }
  } else {
    displayError("Please enter valid city name");
  }
}

export function loadCurrentPosition() {
  weatherSugestionList.style.display = "none";
  weatherCurrent.textContent = "Loading...";
  navigator.geolocation.getCurrentPosition;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      loadWeatherData(longitude, latitude);
    },
    (error) => {
      console.error("Geolocation Error:", error);
      weatherCurrent.textContent = "Please enable location services.";
    }
  );
}

export function loadChosenCity(e) {
  // preparing data for chosen city from filteredCities array

  const indexOfSelectedCity = getIndexOfSelectedCity(e);

  const {
    coord: { lon, lat },
  } = filteredCities[indexOfSelectedCity];

  loadWeatherData(lon, lat);
  weatherSugestionList.style.display = "none";
}
