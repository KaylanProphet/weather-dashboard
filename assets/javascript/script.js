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

//adds to local storage
function addsToLocalStorage(city){
    var cityList = JSON.parse(localStorage.getItem("cityList")) || []
    if(cityList.includes(city)) return
    cityList.push(city)
    localStorage.setItem("cityList", JSON.stringify(cityList))
}

function addsButton(){
var cityList = JSON.parse(localStorage.getItem("cityList")) || []
var cityHistory = document.getElementById("searchHistory")
cityHistory.innerHTML = ""
cityList.forEach((city)=> {
var cityButton = document.createElement("button")
cityButton.textContent = city
cityHistory.append(cityButton)
})
}

//displays weather on page
function displayWeather(currentWeatherData, forecastWeatherData) {
addsToLocalStorage(currentWeatherData.name)
addsButton()

    //placing js into the html
    mainDivEl.innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <img src="http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png"/>
        <p class="">Temp: ${currentWeatherData.main.temp} °f</p>
        <p>Humidity: ${currentWeatherData.main.humidity}</p>
        <p>Wind: ${currentWeatherData.wind.speed}</p>
        <br>
   
     `
     console.log(forecastWeatherData)

     var forecast = document.getElementById("forecast")
     forecast.innerHTML = ""
     //for loop for date for 5 day forecast
     for (var i=0; i < 5; i++) {
         var wrapperElement = document.createElement("div")
         var dateElement = document.createElement("p")
         wrapperElement.classList.add("col")
         var currentDate = new Date(parseInt(forecastWeatherData.daily[i].dt)*1000)
         dateElement.textContent = currentDate.toLocaleDateString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
         var tempElement = document.createElement("p")
         tempElement.textContent = forecastWeatherData.daily[i].temp.day
         wrapperElement.append(dateElement, tempElement)
         forecast.append(wrapperElement)
     }




}

searchFormEl.addEventListener("submit", formSubmitHandler);