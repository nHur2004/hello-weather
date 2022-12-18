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

    cityInput.value = '';
}

var historicalSearchHandler = function(event) {
    event.preventDefault();
}

// searchedCity's weather condition display
var cityWeatherGetter = function(city) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    // function goes here
                })
        })
}

// City added to historyList
var historyButtonMaker = function(searchedCity) {
    var pastSearch = document.createElement("button");
        pastSearch.textContent = searchedCity;
        pastSearch.classList = "btn cityButton";
        pastSearch.setAttribute("type", "submit");
        pastSearch.setAttribute("id", "cityButton historicaLButton");
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
// historyList functionality | click previous city to search that city | put thru weatherCondition function

// empty history button
var clearHistory = function() {
    pastSearchesContainer.innerHTML = "";
    localStorage.removeItem("pastSearchArr");
    presentSearchArr = [];
}

// UV index color functionality

// forecast display and functionality

// handler listeners
searchForm.addEventListener("submit", searchFormHandler);
pastSearchesContainer.addEventListener("submit", historicalSearchHandler);
clearHistoryButton.addEventListener("click", clearHistory);

// load page history
loadHistory();