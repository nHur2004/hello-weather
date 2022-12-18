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

    cityInput.value = '';
}

// historyList functionality | click previous city to search that city | put thru weatherCondition function
var historicalSearchHandler = function(event) {
    event.preventDefault();
    var button = document.getElementById("historicalButton");
    var city = button.dataset.city;
    
    console.log(city + ' was searched.');
    cityWeatherGetter(city);
}
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

// cityInfo HTML maker
var cityInfoGenerator = function (weather, searchCity) {
    cityWeatherInfo.textContent = '';
    
    var cityNameDisplay = document.createElement("h3");
    cityNameDisplay.textContent = weather.name;
    cityWeatherInfo.appendChild(cityNameDisplay);

    var currentDate = document.createElement("span");
    currentDate.setAttribute("id", "currentDay")
    currentDate.textContent = " [" + moment(weather.dt).format("MM/DD/YY") + "]: ";
    cityNameDisplay.appendChild(currentDate);

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
var UVIndexConditions = function(UVrange) {
    var UVSpan = document.getElementById("UVspan");

    if ( UVrange <= 2 ) {
        $(UVSpan).addClass( "bg-success bg-gradient" );
    } else if ( UVrange <= 5 ) {
        $(UVSpan).addClass( "bg-warning bg-gradient" );
    } else if ( UVrange <= 7 ) {
        $(UVSpan).addClass( "bg-danger bg-gradient" );
    } else if ( UVrange <= 10 ) {
        $(UVSpan).addClass( "bg-secondary bg-gradient" );
    } else if ( UVrange >= 11 ) {
        $(UVSpan).addClass( "bg-dark bg-gradient text-warning" )
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
    UVIndexConditions(uvi.value)

    cityUVI.appendChild(cityUVIValue);
    cityInfo.appendChild(cityUVI);
}

// forecast display and functionality

// handler listeners
searchForm.addEventListener("submit", searchFormHandler);
pastSearchesContainer.addEventListener("submit", historicalSearchHandler);
clearHistoryButton.addEventListener("click", clearHistory);

// load page history
loadHistory();