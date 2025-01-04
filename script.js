const showSelectedCity = document.querySelector(".weather__city-selected-text");
const clearBtn = document.querySelector(".weather__clean-btn");
const weatherSugestionList = document.querySelector(".weather__sugesting-list");
const cityNameInput = document.querySelector(".weather__input");
const weatherCurrent = document.querySelector(".weather__current");
const searchBtn = document.querySelector(".weather__search-btn");

const apiKey = "b10e79705c099860a980640a091a6fcf";

let citySelected = "";
let filteredCities = [];

clearBtn.addEventListener("click", () => {
  clearWindow();
  weatherSugestionList.style.display = "none";
});

cityNameInput.addEventListener("keyup", showSuggestingCityList);
cityNameInput.addEventListener("click", () => (weatherSugestionList.style.display = "block"));
weatherSugestionList.addEventListener("click", showWeather);

async function showSuggestingCityList() {
  citySelected = cityNameInput.value;

  if (citySelected.length >= 3) {
    try {
      filteredCities = await loadSuggestionList(citySelected);

      displaySugestionCity(filteredCities);
    } catch (error) {
      displayError(`Could not load suggestion cities list: ${error}`);
    }
  } else {
    filteredCities = [];
    weatherSugestionList.textContent = "";
  }
}

function showWeather(e) {
  const indexOfSelectedCity = getIndexOfSelectedCity(e);

  loadWeatherData(filteredCities[indexOfSelectedCity]);
  weatherSugestionList.style.display = "none";
}
function getIndexOfSelectedCity(e) {
  const child = Array.from(weatherSugestionList.children);
  const index = child.indexOf(e.target);
  return index;
}

async function loadSuggestionList(cityName) {
  try {
    const cityListData = await fetchSuggestionCityList();

    const sortData = cityListData.filter((city) => city.name.toLowerCase().startsWith(cityName));

    return sortData;
  } catch (error) {
    displayError(error);
  }
}

async function loadWeatherData(chossenCity) {
  const {
    coord: { lon, lat },
  } = chossenCity;

  weatherCurrent.textContent = "";

  if (chossenCity) {
    try {
      const weatherData = await getWeatherData(lon, lat, "weather");
      const forecastData = await getWeatherData(lon, lon, "forecast");

      displayWeather(weatherData);
      displayForecast(forecastData);
    } catch (error) {
      displayError(error);
    }
  } else {
    displayError("Please enter valid city name");
  }
}

async function fetchSuggestionCityList() {
  const cityList = "./city.list.json";

  const response = await fetch(cityList);
  if (!response.ok) {
    throw new Error("Could not fetch sugestion cities");
  }

  return await response.json();
}

async function getWeatherData(lon, lat, type) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(weatherUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}

function displaySugestionCity(data) {
  weatherSugestionList.textContent = "";

  data.forEach((cities) => {
    const { name: name, state: state, country: country } = cities;

    const citiesList = createElementWithClass("li", "weather__sugesting-items", `${name}, ${state}, ${country}`);

    weatherSugestionList.append(citiesList);
  });
}

function displayWeather(data) {
  const {
    name: city,
    sys: { country },
    main: { feels_like, temp },
    weather: [{ id, description }],
  } = data;

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

function displayForecast(data) {
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

function getWeatherImg(weatherId) {
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

function displayError(message) {
  showSelectedCity.textContent = "";

  const weatherDisplay = createElementWithClass("div", "weather__display");
  const errorDisplay = createElementWithClass("p", "error", message);

  weatherCurrent.append(weatherDisplay);
  weatherDisplay.append(errorDisplay);
}

// helper functions for converting and creating elements

function toCelsius(t) {
  return (t - 273).toFixed(0);
}

function getDayName(dateStr) {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function clearWindow() {
  cityNameInput.value = "";
  showSelectedCity.textContent = "";
  weatherCurrent.textContent = "";
}

function createElementWithClass(tag, className, textContent = "") {
  const element = document.createElement(tag);
  element.classList.add(className);
  if (textContent) element.textContent = textContent;
  return element;
}
