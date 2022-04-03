var openWeatherKey = 'fa76fa6f5e500e955413a68a9cb747d7'
var searchFormEl = document.querySelector("#search-form");
var searchCityInputEl = document.querySelector("#searchcity");
var mainDivEl = document.querySelector('#main-div');

var formSubmitHandler = function(event) {
    event.preventDefault();
    var searchValue = searchCityInputEl.value.trim();

    if (!searchValue) return;

    getWeather(searchValue)

};

async function getWeather (citySearchVal) {
    try {
        //current weather
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchVal}&units=imperial&appid=${openWeatherKey}`;
        const rawData = await fetch(url);
        const currentWeatherData = await rawData.json();

        const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&units=imperial&appid=${openWeatherKey}`;
        const rawData2 = await fetch(url2);
        const forecastWeatherData = await rawData2.json();

        console.log(currentWeatherData,forecastWeatherData);

        displayWeather(currentWeatherData)

    } catch (err) {
        console.log(err)
    }
}

function displayWeather (currentWeatherData,forecastWeatherData) {

    mainDivEl.innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <p>${currentWeatherData.weather.description}
        <p class="">Temp: ${currentWeatherData.main.temp} °f</p>
        <p>Humidity: ${currentWeatherData.main.humidity}</p>
        <p>Wind: ${currentWeatherData.wind.speed}</p>
    
    `


}

searchFormEl.addEventListener("submit", formSubmitHandler);


// const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${openWeatherKey}`;
