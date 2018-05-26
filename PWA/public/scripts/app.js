
//Immediately Invoked Function Expression
(function() {
  'use strict';



  // Get a reference to the database service
  var database = firebase.database().ref("/weather");

  var app = {
    isLoading: true,
    visibleCards: {},
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    //addDialog: document.querySelector('.dialog-container'),
  };

   

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.getForecast();
  });


  /*도시추가 및 지역 선택 기능  졸작으로 하자.
    document.getElementById('butAdd').addEventListener('click', function() {
      // Open/show the add new city dialog
      app.toggleAddDialog(true);
    });

    document.getElementById('butAddCity').addEventListener('click', function() {
      // Add the newly selected city
      var select = document.getElementById('selectCityToAdd');
      var selected = select.options[select.selectedIndex];
      var key = selected.value;
      var label = selected.textContent;
      if (!app.selectedCities) {
        app.selectedCities = [];
      }
      app.getForecast(key, label);
      app.selectedCities.push({key: key, label: label});
      app.saveSelectedCities();
      app.toggleAddDialog(false);
    });

    document.getElementById('butAddCancel').addEventListener('click', function() {
      // Close the add new city dialog
      app.toggleAddDialog(false);
    });

    app.toggleAddDialog = function(visible) {
      //Methods to update/refresh the UI
      // Toggles the visibility of the add new city dialog.
      if (visible) {
        app.addDialog.classList.add('dialog-container--visible');
      } else {
        app.addDialog.classList.remove('dialog-container--visible');
      }
    };
  */




  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    

    var temp      = data.current.temp;
    var condition = data.current.condition;
    var weekly    = data.weekly;


    var card = app.visibleCards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      //card.querySelector('.location').textContent = data.label;
      card.removeAttribute('hidden');
      
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    }

    /*  효율적인 코딩을 위한 cost 줄이기_ 시간 이용
        // Verifies the data provide is newer than what's already visible
        // on the card, if it's not bail, if it is, continue and update the
        // time saved in the card
        var dataLastUpdated = new Date(data.created);
        var cardLastUpdatedElem = card.querySelector('.card-last-updated');
        var cardLastUpdatcled = cardLastUpdatedElem.textContent;
        if (cardLastUpdated) {
          cardLastUpdated = new Date(cardLastUpdated);
          // Bail if the card has more recent data then the data
          if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
            return;
          }
        }
        cardLastUpdatedElem.textContent = data.created; 
    */


    card.querySelector('.current .icon').classList.add(app.getIconClass(temp.weather));
    card.querySelector('.location').textContent                              = temp.label;
    //card.querySelector('.description').textContent                         = temp.weather;
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
  


  database.on('value',function(snapshot){
    console.log(4);
    app.updateForecastCard(snapshot.val());
  });

  app.getForecast();

   // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
