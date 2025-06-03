import { showSelectedCity, weatherSugestionList, cityNameInput, weatherCurrent } from "./main.js";
import { toCelsius, getDayName, getWeatherImg, createElementWithClass } from "./helperFunctions.js";

export function displaySugestionCity(data) {
  weatherSugestionList.textContent = "";

  data.forEach((cities) => {
    const { name: name, state: state, country: country } = cities;

    const citiesList = createElementWithClass("li", "weather__sugesting-items", `${name}, ${state}, ${country}`);

    weatherSugestionList.append(citiesList);
  });
}

export function displayWeather(data) {
  const {
    name: city,
    sys: { country },
    main: { feels_like, temp },
    weather: [{ id, description }],
  } = data;

  weatherCurrent.textContent = "";

  showSelectedCity.textContent = ` ${city}, ${country}`;
  cityNameInput.value = ` ${city}, ${country}`;

  const realTemperature = toCelsius(temp);
  const feelsLikeTemperature = toCelsius(feels_like);

  const weatherDisplay = createElementWithClass("div", "weather__display");
  const displayCard = createElementWithClass("div", "weather__card");
  const displayRealTemp = createElementWithClass("div", "weather__real-temperature", `${realTemperature}\u00B0C`);
  const displayFeelTemp = createElementWithClass("div", "weather__feel-temperature", `feels: ${feelsLikeTemperature}\u00B0C`);
  const weatherCondition = createElementWithClass("div", "weather__condition");
  const weatherDescription = createElementWithClass("p", "weather__description", `${description}`);
  const weatherCity = createElementWithClass("p", "weather__city-description", `${city}, ${country}`);
  const weatherImage = createElementWithClass("div", "weather__image");

  const weatherImg = document.createElement("img");
  weatherImg.src = `img/${getWeatherImg(id)}.svg`;

  weatherCurrent.append(weatherDisplay);
  weatherDisplay.append(displayCard);
  displayCard.append(displayRealTemp, displayFeelTemp);
  weatherDisplay.append(weatherCondition);
  weatherCondition.append(weatherDescription, weatherCity);
  weatherDisplay.append(weatherImage);
  weatherImage.append(weatherImg);
}

export function displayForecast(data) {
  const weatherForecast = document.createElement("div");
  weatherForecast.classList.add("weather__forecast");
  weatherCurrent.appendChild(weatherForecast);

  const dailyForecast = data.list.filter((item) => item.dt_txt.includes("15:00:00"));

  dailyForecast.forEach((day) => {
    const {
      dt_txt,
      main: { temp_max, temp_min },
      weather: [{ id, description }],
    } = day;

    const shortDayName = getDayName(dt_txt).toUpperCase();
    const dayMaxValue = toCelsius(temp_max);
    const nightMinValue = toCelsius(temp_min);

    const weatherDays = createElementWithClass("div", "weather__days");
    const weatherDayName = createElementWithClass("div", "weather__day-name", shortDayName);
    const weatherImage = createElementWithClass("div", "weather__day-image");
    const dayCondition = createElementWithClass("div", "weather__day-condition", description);
    const dayTemperatureInfo = createElementWithClass("div", "weather__day-temperature");
    const dayHighest = createElementWithClass("div", "weather__day-info", "Day");
    const dayValue = createElementWithClass("div", "weather__day-value", `${dayMaxValue}\u00B0C`);
    const nightValue = createElementWithClass("div", "weather__night-value", `${nightMinValue}\u00B0C`);
    const nightLovest = createElementWithClass("div", "weather__day-info", "Night");

    const weatherImg = document.createElement("img");
    weatherImg.src = `img/${getWeatherImg(id)}.svg`;

    weatherForecast.append(weatherDays);
    weatherDays.append(weatherDayName, weatherImage);
    weatherImage.append(weatherImg);
    weatherDays.append(dayCondition, dayTemperatureInfo);
    dayTemperatureInfo.append(dayHighest, dayValue);
    dayTemperatureInfo.append(nightValue, nightLovest);
  });
}

export function displayError(message) {
  weatherCurrent.textContent = "";
  showSelectedCity.textContent = "";

  const weatherDisplay = createElementWithClass("div", "weather__display");
  const errorDisplay = createElementWithClass("p", "error", message);

  weatherCurrent.append(weatherDisplay);
  weatherDisplay.append(errorDisplay);
}
