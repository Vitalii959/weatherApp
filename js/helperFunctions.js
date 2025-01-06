import { weatherSugestionList } from "./main.js";
import { displayError } from "./displayData.js";
import { getSuggestionCityList } from "./fetchData.js";

export function toCelsius(t) {
  return t.toFixed(0);
}

export function getDayName(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-US", { weekday: "short" });
}
export function getWeatherImg(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId <= 300:
      return "thunderstorm";

    case weatherId >= 300 && weatherId <= 400:
      return "drizzle";

    case weatherId >= 500 && weatherId <= 600:
      return "rainy";

    case weatherId >= 600 && weatherId <= 700:
      return "snow";

    case weatherId === 800:
      return "sunny";

    case weatherId >= 801 && weatherId <= 900:
      return "cloudly";

    case weatherId >= 701 && weatherId <= 771:
      return "mist";

    case weatherId === 781:
      return "tornado";
  }
}
export function getIndexOfSelectedCity(e) {
  const child = Array.from(weatherSugestionList.children);
  const index = child.indexOf(e.target);
  return index;
}
export function createElementWithClass(tag, className, textContent = "") {
  const element = document.createElement(tag);
  element.classList.add(className);
  if (textContent) element.textContent = textContent;
  return element;
}

export async function sortSuggestionList(cityName) {
  try {
    const cityListData = await getSuggestionCityList();

    const sortData = cityListData.filter((city) => city.name.toLowerCase().includes(cityName));

    return sortData;
  } catch (error) {
    displayError(error);
  }
}
