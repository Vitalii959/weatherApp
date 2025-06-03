import {CONFIG} from "./config.js"
import { loadChosenCity, loadCurrentPosition, loadWeatherData, loadSuggestingCityList } from "./loadData.js";

export const showSelectedCity = document.querySelector(".weather__city-selected-text");
export const clearBtn = document.querySelector(".weather__clean-btn");
export const weatherSugestionList = document.querySelector(".weather__sugesting-list");
export const cityNameInput = document.querySelector(".weather__input");
export const weatherCurrent = document.querySelector(".weather__current");
export const currentLocationBtn = document.querySelector(".weather__current-loc-btn");

export const apiKey = CONFIG.API_KEY;

export let citySelected = "";
export let filteredCities = [];

clearBtn.addEventListener("click", () => {
  clearWindow();
  weatherSugestionList.style.display = "none";
});

currentLocationBtn.addEventListener("click", loadCurrentPosition);
cityNameInput.addEventListener("keyup", loadSuggestingCityList);
cityNameInput.addEventListener("click", () => (weatherSugestionList.style.display = "block"));
weatherSugestionList.addEventListener("click", loadChosenCity);

// helper functions for converting and creating elements

function clearWindow() {
  cityNameInput.value = "";
  showSelectedCity.textContent = "";
  weatherCurrent.textContent = "";
}
