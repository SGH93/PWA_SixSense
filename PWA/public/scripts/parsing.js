
//Immediately Invoked Function Expression
(function() {
  'use strict';

  var app = {
    isLoading: true,
    //visibleCards: {},
    spinner: document.querySelector('.loader'),
    card: document.querySelector('.card'),
    container: document.querySelector('.main'),
  };

  // Get a reference to the database service
  var database = firebase.database().ref("/weather");
  database.on('value',function(snapshot){
    console.log(4);
    app.updateForecastCard(snapshot.val());
    initialWeatherForecast = snapshot.val();
  });

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.getForecast();
  });


  document.getElementById('butAdd').addEventListener('click', function() {
    alert('업데이트 예정입니다.');
  });

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    

    var temp      = data.current.temp;
    var condition = data.current.condition;
    var weekly    = data.weekly;


    var card = app.card;
    /*if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    } */

    card.querySelector('.current .icon').classList.add(app.getIconClass(temp.weather));
    card.querySelector('.location').textContent                              = temp.label;
    card.querySelector('.description').textContent                         = temp.weather;
    card.querySelector('.date').textContent                                  = temp.time;
    card.querySelector('.current .temperature .value').textContent           = temp.degree;
    card.querySelector('.current .description .dust .value').textContent     = condition.dust;
    card.querySelector('.current .description .sensible .value').textContent = condition.temp.sensible;
    card.querySelector('.current .description .highest .value').textContent  = condition.temp.highest;
    card.querySelector('.current .description .lowest .value').textContent   = condition.temp.lowest;
    

    var nextDays = card.querySelectorAll('.future .oneday');
    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = weekly[i];
      if (daily && nextDay) {
        nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
        nextDay.querySelector('.date').textContent             = daily.date;
        nextDay.querySelector('.day').textContent              = daily.day;
        nextDay.querySelector('.temp-high .value').textContent = daily.high;
        nextDay.querySelector('.temp-low .value').textContent  = daily.low;
      }
    }

    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };

  app.getForecast = function() {
    
    var url = 'https://pwa-sixsense.firebaseio.com/weather/.json'
    if ('caches' in window) {
      /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json;
            console.log(1);
            app.updateForecastCard(results);
          });
        }
      });
    }

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response;
          console.log(2);
          initialWeatherForecast = results;
          app.updateForecastCard(results);
        }
      } else {
        //Return the initial weather forecast since no data is available.
        console.log(3);
        app.updateForecastCard(initialWeatherForecast);
      }
    };
    
    request.open('GET', url);
    request.send();


  };

  // Iterate all of the cards and attempt to get the latest forecast data

  app.getIconClass = function(weather) {
    switch (weather) {
      case '맑음': 
        return 'clear-day';
      case '비':
        return 'rain';
      case '뇌우': 
      case '흐려져뇌우':
        return 'thunderstorms'
      case '소낙눈':  
      case '흐려져눈':  
        return 'snow';
      case '안개': 
        return 'fog';
        return 'windy';
      case '흐림': 
      case '흐려짐': 
      case '구름많음':
        return 'cloudy';
      case '구름조금':  
        return 'partly-cloudy-day';
      case '진눈깨비':
        return 'sleet';
      case '흐린후갬': 
      case '뇌우후갬': 
      case '비후갬': 
      case '눈후갬': 
      case '진눈깨비후갬': 
        return 'cloudy_s_sunny';
      case '황사':  
        return 'yellow-dust';        
      case '소나기':
        return 'scattered-showers';
    }
  };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialWeatherForecast = { 
    "current": {
      "temp" :{
        "degree": "",
        "weather": "",
        "label": "",
        "time":"",
        "created": ""
      },

      "condition": {
        "temp": {
          "highest": "",
          "lowest": "",
          "sensible": ""
        },
        "dust": ""
      }
    },
    "weekly": [
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""}
    ]
  };
  
  app.getForecast();

   // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
