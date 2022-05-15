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

var buttonClickHandler = function (event) {
    event.preventDefault();
    console.log(event.currentTarget.innerText)
    var searchValue = event.currentTarget.innerText


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
function addsToLocalStorage(city) {
    //city list array from local storage, that was a string, we are parsing it to JSON, ||(or operator), or empty array 
    var cityList = JSON.parse(localStorage.getItem("cityList")) || []
    //if this array already includes that city, return, to prevent duplicates
    if (cityList.includes(city)) return
    //push to the end of the array
    cityList.push(city)
    //turn it back into a string?
    localStorage.setItem("cityList", JSON.stringify(cityList))
}

function addsButton() {
    //getting the city list from local storage array or empty array if it has no value
    var cityList = JSON.parse(localStorage.getItem("cityList")) || []
    //this variable represents the searchHistory class in the html
    var cityHistory = document.getElementById("searchHistory")
    //??????
    cityHistory.innerHTML = ""
    cityList.forEach((city) => {
        //this variable will create a button the document
        var cityButton = document.createElement("button")
        //text content is???
        cityButton.textContent = city
        //this event listner is waiting for a click event to carry out the button click handler function
        cityButton.addEventListener("click", buttonClickHandler)
        //puts the new button on the document 
        cityHistory.append(cityButton)
    })
}

function displayUVI(UVI) {

    var classColor = ""
    // 2 or less green
    if (UVI < 3) classColor = "green"
    // 3-5 yellow
    if (UVI >= 3 && UVI < 6) classColor = "yellow"
    //6-7 orange
    if (UVI >= 6 && UVI < 8) classColor = "orange"
    //8-10 red
    if (UVI >= 8) classColor = "red"
    //this will return the information and create a p tag on the document, using the css class as a reference to pass the correct color. ${UVI} is how the 
    //variable is passed in to the document
    return `<p class="${classColor}">UVI: ${UVI}</p>`
}
//displays weather on page
function displayWeather(currentWeatherData, forecastWeatherData) {
    //takes the current weather name and uses it in the local storage function
    addsToLocalStorage(currentWeatherData.name)
    //adds button from previous search history
    addsButton()


    //placing js into the html
    mainDivEl.innerHTML = `
        <h2>${currentWeatherData.name}</h2>
        <img src="http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png"/>
        <p class="">Temp: ${currentWeatherData.main.temp} °f</p>
        <p>Humidity: ${currentWeatherData.main.humidity}</p>
        <p>Wind: ${currentWeatherData.wind.speed}</p>
        ${displayUVI(forecastWeatherData.current.uvi)}
        <br>
   
     `
    console.log(forecastWeatherData)


    //Displays the 5 day forecast
    var forecast = document.getElementById("forecast")
    forecast.innerHTML = ""
    //for loop for date for 5 day forecast
    for (var i = 0; i < 5; i++) {
        //to contain each card/day, by creating a div to put the forecast data in
        var wrapperElement = document.createElement("div")
        //a var to create a p tag
        var dateElement = document.createElement("p")
        //taking the wrapperElement var, going to its class list property, and then adding col and card
        wrapperElement.classList.add("col", "card")
        //takes the date parses it into a number, that we got from the api,multiply it by 1000 (because its UNIX time) and craetes a new date, stores it in the current date var
        var currentDate = new Date(parseInt(forecastWeatherData.daily[i].dt) * 1000)
        //toLocaleDateString takes currentDate and turns it into a string that it will go in the dateElement var
        dateElement.textContent = currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        //holds a p tag
        var tempElement = document.createElement("p")
        //passes the temp from the data into the tempElement's text content
        tempElement.textContent = forecastWeatherData.daily[i].temp.day
        var humidityElement = document.createElement("p")
        humidityElement.textContent = forecastWeatherData.daily[i].humidity
        var windElement = document.createElement("p")
        windElement.textContent = forecastWeatherData.daily[i].wind_speed
        //put my wrapperElement on the doc and the date and temp inside it?
        wrapperElement.append(dateElement, tempElement, humidityElement, windElement)
        //using the forecast id on the html, append the wrappersElement there
        forecast.append(wrapperElement)
    }




}
//adds the search history buttons
addsButton()
searchFormEl.addEventListener("submit", formSubmitHandler);