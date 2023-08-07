import CONSTS from "./const.js";

const printMessageError = () => alert("Error");
const loadListenersTable = () => {
  let btnsViews = document.querySelectorAll(".btn-view");
  let btnsDelete = document.querySelectorAll(".btn-delete");
  btnsViews.forEach((btn) => {
    let nameCity = btn.dataset.city;
    btn.addEventListener("click", (e) => {
      let findCity = JSON.parse(
        localStorage.getItem("weather-app")
      ).searchs.find((currentCity) => currentCity.nameCity === nameCity);
      printInformationWeather(findCity);
    });
  });

  btnsDelete.forEach((btn) => {
    let nameCity = btn.dataset.city;
    btn.addEventListener("click", (e) => {
      let dataWeather = JSON.parse(localStorage.getItem("weather-app"));
      dataWeather.searchs = dataWeather.searchs.filter(
        (currentData) => currentData.nameCity !== nameCity
      );
      printTable(dataWeather.searchs);
      localStorage.setItem("weather-app", JSON.stringify(dataWeather));
    });
  });
};

const printTable = (weatherSearchs) => {
  if (weatherSearchs.length > 0) {
    document.querySelector("#table-containerData").classList.remove("hide");
    document.querySelector("#table-containerEmpty").classList.add("hide");
    document.querySelector("#tbody").innerHTML = "";
    for (let search of weatherSearchs) {
      document.querySelector("#tbody").innerHTML += `
        <tr>
          <td id="nameCity">${search.nameCity}</td>
          <td>
              <div class="buttons">
              <button class="btn-view" data-city="${search.nameCity}">
                  <i class="fa-solid fa-eye"></i>
                  </button>
              <button class="btn-delete" data-city="${search.nameCity}">
                  <i class="fas fa-trash"></i>
              </button>
              </div>
          </td>
        </tr>
        `;
    }

    loadListenersTable();
  } else {
    document.querySelector("#table-containerData").classList.add("hide");
    document.querySelector("#table-containerEmpty").classList.remove("hide");
  }
};

const saveSearch = (dataCity) => {
  let weatherData = JSON.parse(localStorage.getItem("weather-app"));
  let findDataByCity = weatherData.searchs.find(
    (data) => data.nameCity === dataCity.nameCity
  );

  if (findDataByCity === undefined) {
    weatherData.searchs.push(dataCity);
    localStorage.setItem("weather-app", JSON.stringify(weatherData));
  }
  printTable(weatherData.searchs);
};

const createObjectWeather = (dataWeather) => {
  return {
    nameCity: dataWeather.name,
    nameCountry: dataWeather.sys.country,
    iconName: dataWeather.weather[0].icon,
    mainWeather: dataWeather.weather[0].main,
    descriptionWeather: dataWeather.weather[0].description,
    temps: {
      humidity: dataWeather.main.humidity,
      temp: dataWeather.main.temp,
      temp_max: dataWeather.main.temp_max,
      temp_min: dataWeather.main.temp_min,
    },
  };
};

const printInformationWeather = (objWeather) => {
  const cardContainer = document.querySelector("#card-container");
  const waitSearch = document.querySelector("#wait-search");
  cardContainer.classList.remove("hide");
  waitSearch.classList.add("hide");

  cardContainer.innerHTML = `
  <div class="card-containerCity">
            <span class="cityName">${objWeather.nameCity}</span> -
            <span class="countryName">${objWeather.nameCountry}</span>
          </div>
          <div class="card-containerIcon">
            <img
              src="https://openweathermap.org/img/wn/${objWeather.iconName}@4x.png"
              alt=""
              class="icon-weather"
            />
            <div class="icon-description">
              <p class="descriptionWeather">${objWeather.mainWeather} - ${objWeather.descriptionWeather}</p>
            </div>
          </div>

          <div class="card-containerWeather">
            <div class="weather">
              <p class="weather-title">Humedad</p>
              <p class="weather-value">${objWeather.temps.humidity}%</p>
            </div>

            <div class="weather">
              <p class="weather-title">Temperatura</p>
              <p class="weather-value">${objWeather.temps.temp}°</p>
            </div>

            <div class="weather">
              <p class="weather-title">Maxima</p>
              <p class="weather-value">${objWeather.temps.temp_max}°</p>
            </div>

            <div class="weather">
              <p class="weather-title">Minima</p>
              <p class="weather-value">${objWeather.temps.temp_min}°</p>
            </div>
          </div>
  `;
  saveSearch(objWeather);
};

document.querySelector("#btn-search").addEventListener("click", async () => {
  let inputCity = document.querySelector("#inputCity").value;

  if (inputCity) {
    let resp = await fetch(`${CONSTS.URL_BASE_SEARCH_BY_NAME}=${inputCity}`)
      .then((resp) => resp.json())
      .catch((err) => console.error(err));

    resp.cod >= 200 && resp.cod < 400
      ? printInformationWeather(createObjectWeather(resp))
      : printMessageError();
  }
});

document.querySelector("#btn-filtrar").addEventListener("click", () => {
  let filterIn = document.querySelector("#input-filter").value;
  if (filterIn) {
    let { searchs } = JSON.parse(localStorage.getItem("weather-app"));
    let filterSearch = searchs.filter(
      (currentCity) => currentCity.nameCity === filterIn
    );

    if (filterSearch.length > 0) {
      printTable(filterSearch);
    }
  }
});

addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("weather-app") === null) {
    localStorage.setItem(
      "weather-app",
      JSON.stringify({
        searchs: [],
      })
    );
  } else {
    const dataWeatherSearch = JSON.parse(localStorage.getItem("weather-app"));
    printTable(dataWeatherSearch.searchs);
  }
});
