function createCityList(citySearchList) {
  $("#city-list").empty();

  let keys = Object.keys(citySearchList);
  for (var i = 0; i < keys.length; i++) {
    let cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    let splitStr = keys[i].toLowerCase().split(" ");
    for (let j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    let titleCasedCity = splitStr.join(" ");
    cityListEntry.text(titleCasedCity);

    $("#city-list").append(cityListEntry);
  }
}

function populateCityWeather(city, citySearchList) {
  createCityList(citySearchList);

  let queryURL = ("https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=4e2c5fc565d3ee0aea683662aac5352b=" = +city);

  let queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=4e2c5fc565d3ee0aea683662aac5352b=" +
    city;

  let latitude;

  let longitude;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    // Stores data into "weather"
    .then(function (weather) {
      // Log the queryURL
      console.log(queryURL);

      // Log the resulting object
      console.log(weather);

      let nowMoment = moment();

      let displayMoment = $("<h3>");
      $("#city-name").empty();
      $("#city-name").append(
        displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
      );

      let cityName = $("<h3>").text(weather.name);
      $("#city-name").prepend(cityName);

      let weatherIcon = $("<img>");
      weatherIcon.attr(
        "src",
        "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
      );
      $("#current-icon").empty();
      $("#current-icon").append(weatherIcon);

      $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
      $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

      latitude = weather.coord.lat;
      longitude = weather.coord.lon;

      let queryURL3 =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=4e2c5fc565d3ee0aea683662aac5352b=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: queryURL3,
        method: "GET",
        // Stores data in UV Index
      }).then(function (uvIndex) {
        console.log(uvIndex);

        let uvIndexDisplay = $("<button>");
        uvIndexDisplay.addClass("btn btn-danger");

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
        console.log(uvIndex[0].value);

        $.ajax({
          url: queryURL2,
          method: "GET",
          // Stores data to "forecast"
        }).then(function (forecast) {
          console.log(queryURL2);

          console.log(forecast);
          // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
          for (let i = 6; i < forecast.list.length; i += 8) {
            // 6, 14, 22, 30, 38
            let forecastDate = $("<h5>");

            let forecastPosition = (i + 2) / 8;

            console.log("#forecast-date" + forecastPosition);

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            let forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            console.log(forecast.list[i].weather[0].icon);

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + forecast.list[i].main.temp + " °F"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );

            $(".forecast").attr(
              "style",
              "background-color:dodgerblue; color:white"
            );
          }
        });
      });
    });
}

$(document).ready(function () {
  let citySearchListStringified = localStorage.getItem("citySearchList");

  let citySearchList = JSON.parse(citySearchListStringified);

  if (citySearchList == null) {
    citySearchList = {};
  }

  createCityList(citySearchList);

  $("#current-weather").hide();
  $("#forecast-weather").hide();

  $("#search-button").on("click", function (event) {
    event.preventDefault();
    let city = $("#city-input").val().trim().toLowerCase();

    if (city != "") {
      //Looks for entered text

      citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));

      populateCityWeather(city, citySearchList);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }
  });

  $("#city-list").on("click", "button", function (event) {
    event.preventDefault();
    let city = $(this).text();

    populateCityWeather(city, citySearchList);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});
