const search_for_places_btn = document.querySelector(".search-btn");
const col1 = document.querySelector(".col-1");
const searchColumn = document.querySelector(".search-col");
const crossBtn = document.querySelector(".cross-btn");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const curTempValue = document.querySelector(".cur-temp .value");
const curTempunit = document.querySelector(".cur-temp .unit");
const curWeatherDesc = document.querySelector(".cur-weather-description p");
const curLocation = document.querySelector(".cur-location p span");
const windStautusValue = document.querySelector(".wind-status .value");
const humidityValue = document.querySelector(".humidity .value");
const visibilityValue = document.querySelector(".visibility .value");
const airPressureValue = document.querySelector(".air-pressure .value");
const dayAndDate = document.querySelector(".day-and-date .date");
const curWeatherImg = document.querySelector(".cur-weather-img");
const curWeatherDetails = document.querySelector(".cur-weather-details");
const humidityIndicator = document.querySelector(".filled");
const dates = document.querySelectorAll(".temp-forecast-cards .day-and-date");
const weatherForecastImgs = document.querySelectorAll(
  ".temp-forecast-cards .weather-img"
);
const maxTemps = document.querySelectorAll(".temp-forecast-cards .max-temp");
const minTemps = document.querySelectorAll(".temp-forecast-cards .min-temp");
const tempConvertors = document.querySelector(".temp-convertors");

search_for_places_btn.addEventListener("click", openSearchColumn);
crossBtn.addEventListener("click", closeSearchColumn);
searchButton.addEventListener("click", search);
tempConvertors.addEventListener("click", convertTemp);

function openSearchColumn(e) {
  searchColumn.style.transform = "translate3d(0vw,0,0)";
}

function closeSearchColumn(e) {
  if (e.target.classList.contains("material-icons")) {
    searchColumn.style.transform = "translate3d(-150vw,0px,0px)";
  }
}

function search(e) {
  const inputValue = searchInput.value;
  const markup = `<div class="searched-place">
  <p>${searchInput.value}</p>
</div>`;
  searchColumn.insertAdjacentHTML("beforeend", markup);
  const searchedPlaces = document.querySelectorAll(".searched-place");
  searchedPlaces.forEach((place) => {
    place.addEventListener("click", fetchWeather);
  });
  searchInput.value = "";

  fetchWeatherInfo(inputValue);
  searchColumn.style.transform = "translate3d(-100vw,0,0)";
}
function fetchWeather(e) {
  const placeName = e.currentTarget.querySelector("p").textContent;
  fetchWeatherInfo(placeName);
  searchColumn.style.transform = "translate3d(-100vw,0,0)";
}

let longitude, latitude;
function fetchWeatherInfo(cityName) {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=08f260a99e7ee99641e7d3cc966b4412`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      latitude = data.coord.lat;
      longitude = data.coord.lon;

      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=08f260a99e7ee99641e7d3cc966b4412`
      );
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderCurTempDetails(data, cityName);
    })
    .catch((err) => {
      alert("city not found!!");
    });
}

function renderCurTempDetails(data, cityName = "Haldwani") {
  curTempValue.textContent = String(
    Math.trunc(Number(data.current.temp) - 273.15)
  );
  curWeatherDesc.textContent = data.current.weather[0].description;
  curWeatherDesc.style.textTransform = "capitalize";
  curLocation.textContent = cityName;
  curLocation.style.textTransform = "capitalize";
  windStautusValue.textContent = (data.current.wind_speed * 2.2369).toFixed(2);
  humidityValue.textContent = data.current.humidity;
  humidityIndicator.style.width = `${data.current.humidity}%`;
  visibilityValue.textContent = (data.current.visibility * 0.000621).toFixed(2);
  airPressureValue.textContent = data.current.pressure;
  for (let i = 0; i < dates.length; i++) {
    const date = new Date(data.daily[i + 1].dt * 1000);
    const dateString = `${days[date.getDay()]}, ${date.getDate()} ${
      months[date.getMonth()]
    }`;
    dates[i].textContent = dateString;
    let img = displayWeatherImage(
      data.daily[i + 1].weather[0].main,
      data.daily[i + 1].weather[0].id
    );
    weatherForecastImgs[i].src = `images/${img}`;
    maxTemps[i].textContent = `${Math.trunc(
      data.daily[i + 1].temp.max - 273.15
    )}\u00B0C`;
    minTemps[i].textContent = `${Math.trunc(
      data.daily[i + 1].temp.min - 273.15
    )}\u00B0C`;
  }

  let img = displayWeatherImage(
    data.current.weather[0].main,
    data.current.weather[0].id
  );

  const imgMarkup = `<img src=images/${img} alt="" />`;
  curWeatherImg.innerHTML = "";
  curWeatherImg.insertAdjacentHTML("afterbegin", imgMarkup);
}
window.addEventListener("load", renderCurLocationDetails);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function renderCurLocationDetails() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=08f260a99e7ee99641e7d3cc966b4412`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          renderCurTempDetails(data, "haldwani");
        });
    });
  }
  let now = new Date();
  let dateStr = `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  }`;
  dayAndDate.textContent = dateStr;
}

function displayWeatherImage(mainDesc, id) {
  let img;
  switch (mainDesc) {
    case "Thunderstorm":
      img = "Thunderstorm.png";
      break;
    case "Drizzle":
      img = "Shower.png";
      break;
    case "Rain":
      if (id === 500) img = "LightRain.png";
      else img = "HeavyRain.png";
      break;
    case "Snow":
      if (id >= 611 && id <= 613) img = "Sleet.png";
      else img = "Snow.png";
      break;
    case "Clear":
      img = "Clear.png";
      break;
    case "Clouds":
      if (id <= 802) img = "LightCloud.png";
      else img = "HeavyCloud.png";
      break;
    default:
      img = "Hail.png";
      break;
  }
  return img;
}
function convertTemp(e) {
  if (e.target.classList.contains("fahrenheit-btn")) {
    curTempValue.textContent = String(
      Math.trunc((Number(curTempValue.textContent) * 9) / 5 + 32)
    );
    curTempunit.textContent = `\u00B0F`;
    for (let i = 0; i < 5; i++) {
      maxTemps[i].textContent = `${Math.trunc(
        (parseInt(maxTemps[i].textContent) * 9) / 5 + 32
      )}\u00B0F`;
      minTemps[i].textContent = `${Math.trunc(
        (parseInt(minTemps[i].textContent) * 9) / 5 + 32
      )}\u00B0F`;
    }
  } else if (e.target.classList.contains("celcius-btn")) {
    curTempValue.textContent = String(
      Math.trunc(((Number(curTempValue.textContent) - 32) * 5) / 9)
    );
    curTempunit.textContent = `\u00B0C`;
    for (let i = 0; i < 5; i++) {
      maxTemps[i].textContent = `${Math.trunc(
        ((parseInt(maxTemps[i].textContent) - 32) * 5) / 9
      )}\u00B0C`;
      minTemps[i].textContent = `${Math.trunc(
        ((parseInt(minTemps[i].textContent) - 32) * 5) / 9
      )}\u00B0C`;
    }
  }
}
