var cities = [];
var presentSearchArr = [];

var clearHistoryButton = document.getElementById("trash");
var searchForm = document.getElementById("searchForm");
var cityInput = document.getElementById("citySearchInput");
var pastSearchesContainer = document.getElementById("historyList");
var cityWeatherInfo = document.getElementById("cityInfo");
var fiveDayForecast = document.getElementById("forecast");
const apiKey = "192ae29ad0b5ef84938fe9c3a7e8baed";

// City Search functionality
var searchFormHandler = function (event) {
    event.preventDefault();
    var city = cityInput.value.trim();

    console.log(city + ' was searched.');
    addToHistoryList(city);

    cityWeatherGetter(city);
    forecastWeatherGetter(city);

    cityInput.value = '';
}

// historyList functionality | click previous city to search that city | put thru weatherCondition function
var historicalSearchHandler = function(event) {
    event.preventDefault();
    var city = event.target.getAttribute("data-city");
    if (city) {
        console.log(city + ' was searched.')
        cityWeatherGetter(city);
        forecastWeatherGetter(city);
    };
};
// searchedCity's weather condition display
var cityWeatherGetter = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    cityInfoGenerator(data);
                })
        })
}

// forecast display and functionality
var forecastWeatherGetter = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    forecastCardGen(data);
                })
        })
}
// forecast card maker
var forecastCardGen = function(forecast) {
    fiveDayForecast.textContent = '';

    for ( i = 0; i < 5; i++ ) {
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "col-sm-2 forecastCard");
        fiveDayForecast.appendChild(forecastCard);

        var forecastDate = document.createElement("h4");
        forecastDate.setAttribute("daysAhead", i + 1);
        forecastDate.textContent = "[" + moment.unix(forecast.list[i].dt).format(" L ") + "]";
        forecastCard.appendChild(forecastDate);

        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@2x.png`);
        weatherIcon.setAttribute("class", "m-0 p-0");
        forecastCard.appendChild(weatherIcon);

        var forecastTemp = document.createElement("span");
        forecastTemp.setAttribute("daysAhead", i + 1);
        forecastTemp.textContent = forecast.list[i].main.temp + " °F";
        forecastCard.appendChild(forecastTemp);

        forecastCard.appendChild(document.createElement("br"));

        var forecastWinds = document.createElement("span");
        forecastWinds.setAttribute("daysAhead", i + 1);
        forecastWinds.textContent = forecast.list[i].wind.speed + " MPH";
        forecastCard.appendChild(forecastWinds);
        
        forecastCard.appendChild(document.createElement("br"));
    }
};

// cityInfo HTML maker
var cityInfoGenerator = function (weather, searchCity) {
    cityWeatherInfo.textContent = '';
    
    var cityNameDisplay = document.createElement("h3");
    cityNameDisplay.textContent = weather.name;
    cityWeatherInfo.appendChild(cityNameDisplay);

    var currentDate = document.createElement("span");
    currentDate.setAttribute("id", "currentDay");
    currentDate.textContent = " [" + moment.unix(weather.dt).format(" L ") + "] ";
    cityNameDisplay.appendChild(currentDate);

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    weatherIcon.setAttribute("class", "m-0 position-absolute");
    cityNameDisplay.appendChild(weatherIcon);

    var cityInfo = document.createElement("p");
    cityInfo.setAttribute("id", "weatherInfo");
    cityWeatherInfo.appendChild(cityInfo);

    var cityTemp = document.createElement("span");
    cityTemp.textContent = "Temperature: " + weather.main.temp + " °F";
    cityInfo.appendChild(cityTemp);

    cityInfo.appendChild(document.createElement("br"));

    var cityWindSpd = document.createElement("span");
    cityWindSpd.textContent = "Wind Speeds: " + weather.wind.speed + " MPH";
    cityInfo.appendChild(cityWindSpd);

    cityInfo.appendChild(document.createElement("br"));

    var cityHumidity = document.createElement("span");
    cityHumidity.textContent = "Humidity: " + weather.main.humidity + " %";
    cityInfo.appendChild(cityHumidity);

    cityInfo.appendChild(document.createElement("br"));
    
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    retrieveUVI(lat, lon);
}

// City added to historyList
var historyButtonMaker = function(searchedCity) {
    var pastSearch = document.createElement("button");
        pastSearch.textContent = searchedCity;
        pastSearch.classList = "btn cityButton";
        pastSearch.setAttribute("type", "submit");
        pastSearch.setAttribute("id", "historicalButton");
        pastSearch.setAttribute("data-city", searchedCity);

        pastSearchesContainer.prepend(pastSearch);
}
// City added to presentSearchArr and sent to localStorage
var addToHistoryList = function (searchedCity) {
    historyButtonMaker(searchedCity);
    presentSearchArr.push(searchedCity);
    
    localStorage.setItem("pastSearchArr", JSON.stringify(presentSearchArr));
}
//load past searches
var loadHistory = function() {
    JSON.parse(localStorage.getItem("pastSearchArr")).forEach(pastSearchArr => {
        addToHistoryList(pastSearchArr);
    });

    console.log(presentSearchArr);
    console.log('Data Loaded.')
};

// empty history button
var clearHistory = function() {
    pastSearchesContainer.innerHTML = "";
    localStorage.removeItem("pastSearchArr");
    presentSearchArr = [];
}

// UV index color functionality
var UVIndexConditions = function(UVrangeTXT) {
    var UVSpan = document.getElementById("UVspan");
    var UVrange = Number(UVrangeTXT);
    console.log(UVrange);
    if ( UVrange <= 2 ) {
        $(UVSpan).addClass( "bg-success bg-gradient" );
        console.log('UV Index is low.')
    } else if ( UVrange <= 5 ) {
        $(UVSpan).addClass( "bg-warning bg-gradient" );
        console.log('UV Index is moderate.')
    } else if ( UVrange <= 7 ) {
        $(UVSpan).addClass( "bg-danger bg-gradient" );
        console.log('UV Index is high.')
    } else if ( UVrange <= 10 ) {
        $(UVSpan).addClass( "bg-secondary bg-gradient" );
        console.log('UV Index is very high.')
    } else if ( UVrange >= 11 ) {
        $(UVSpan).addClass( "bg-dark bg-gradient text-warning" );
        console.log('UV Index is extreme.')
    }
}
// UV index getter
var retrieveUVI = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (uvi) {
                buildUVI(uvi);
            })
        })
}
// UV index builder
var buildUVI = function (uvi) {
    var cityInfo = document.getElementById("weatherInfo");

    var cityUVI = document.createElement("span");
    cityUVI.textContent = "UV Index: ";

    var cityUVIValue = document.createElement("span");
    cityUVIValue.setAttribute("id", "UVspan");
    cityUVIValue.textContent = uvi.value;

    cityUVI.appendChild(cityUVIValue);
    cityInfo.appendChild(cityUVI);

    UVIndexConditions(uvi.value)
}

// handler listeners
searchForm.addEventListener("submit", searchFormHandler);
pastSearchesContainer.addEventListener("click", historicalSearchHandler);
clearHistoryButton.addEventListener("click", clearHistory);

// load page history
loadHistory();