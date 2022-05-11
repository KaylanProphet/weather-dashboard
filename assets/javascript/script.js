var openWeatherKey = 'fa76fa6f5e500e955413a68a9cb747d7'
var searchFormEl = document.querySelector("#search-form");
var searchCityInputEl = document.querySelector("#searchcity");
var mainDivEl = document.querySelector('#main-div');

var formSubmitHandler = function (event) {
    event.preventDefault();
    var searchValue = searchCityInputEl.value.trim();

    if (!searchValue) return;

    getWeather(searchValue)

};

//calling open weather api
async function getWeather(citySearchVal) {
    try {
        //current weather using open weather map
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchVal}&units=imperial&appid=${openWeatherKey}`;
        const rawData = await fetch(url);
        const currentWeatherData = await rawData.json();

        //5 day weather forecast using open weather map
        const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&exclude=minutely,hourly&units=imperial&appid=${openWeatherKey}`;
        const rawData2 = await fetch(url2);
        const forecastWeatherData = await rawData2.json();

        console.log(currentWeatherData, forecastWeatherData);

        displayWeather(currentWeatherData, forecastWeatherData)

    } catch (err) {
        console.log(err)
    }
}

//displays weather on page
function displayWeather(currentWeatherData, forecastWeatherData) {

    //placing js into the html
    mainDivEl.innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <p>${currentWeatherData.weather.icon}
        <p class="">Temp: ${currentWeatherData.main.temp} °f</p>
        <p>Humidity: ${currentWeatherData.main.humidity}</p>
        <p>Wind: ${currentWeatherData.wind.speed}</p>
        <br>
   
     `
     //for loop for date for 5 day forecast
     for (var i=0; i < 5; i++) {
         var dateElement = document.createElement("p")
         //TODO change the date from unix
         dateElement.textContent = forecastWeatherData.daily[i].dt
         document.getElementById("forecast").append(dateElement)
     }
    //for loop for 5 day temp forecast
    for (var i = 0; i < 5; i++) {
        var tempElement = document.createElement("p")
        tempElement.textContent = forecastWeatherData.daily[i].temp.day
        document.getElementById("forecast").append(tempElement)
    }



}

searchFormEl.addEventListener("submit", formSubmitHandler);