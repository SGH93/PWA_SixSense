/*eslint prefer-arrow-callback: 0*/
//Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const request   = require('request');
const cheerio   = require('cheerio');
const firebase  = require('firebase');
const schedule  = require('node-schedule');
admin.initializeApp();
let tokens = []; // All Device tokens to send a notification to.
var highest, lowest, dust, weather;


var config = {
  apiKey: "AIzaSyBFicio-00qyg8iluC4Zr--2Ix9K96GzVo",
  authDomain: "chatweb-5dc1a.firebaseapp.com",
  databaseURL: "https://chatweb-5dc1a.firebaseio.com",
  projectId: "chatweb-5dc1a",
  storageBucket: "chatweb-5dc1a.appspot.com",
  messagingSenderId: "451413788733"
}; firebase.initializeApp(config);


var func_get_C_data =
function () {
        var url = "https://m.weather.naver.com/";

        var current = {
          "temp" :{
              "degree": " ",
              "weather": "32",
              "label": " ",
              "time":" ",
              "created": " "
          },

          "condition": {
              "temp": {
              "highest": " ",
              "lowest": " ",
              "sensible": " "
              },
              "dust": " "
          }
        };

        var DB_Ref = firebase.database().ref("/weather/current");

console.log('func_get_C_data start');
        request(url, (err, res, html) => {
            if (!err) {
                var $ = cheerio.load(html);       
                var d = new Date(); 
console.log(current+'\ncurrent');
        //크롤링
            //temp
                //degree
                var temp = $("em.degree_code.full"); //현재 온도
                current["temp"]["degree"] = temp.text();                
                
                //weather
                //temp = $("div.weather_set_summary"); //날씨 텍스트
                //current["temp"]["weather"] = temp.text();         

                //label
                temp = $("div.section_location > a.title._cnLnbLinktoMap > strong")
                current["temp"]["label"] = temp.text(); //위치

                //time
                current["temp"]["time"] = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString() +"/" + d.getDate().toString() +"  " + 
                                        ((d.getUTCHours()+9)%24).toString() +" : " + d.getMinutes().toString() + " : " + d.getSeconds().toString();

                //created
                temp = $("div.card.card_now > span.text.text_location")
                current["temp"]["created"] = temp.text(); // 날씨 발표 시간

            //condition
                //temp:highest
                temp = $("span.day_high > em.degree_code");
                current["condition"]["temp"]["highest"] = temp.text();   //오늘 최고기온

                //temp:lowest
                temp = $("span.day_low > em.degree_code");
                current["condition"]["temp"]["lowest"] = temp.text();    //오늘 최저기온
                
                //temp:sensible
                temp = $("span.day_feel > em.degree_code");
                current["condition"]["temp"]["sensible"] = temp.text();    //오늘 체감기온

                //dust
                temp = $("li.finedust > span.level3 > em");
                current["condition"]["dust"] = temp.text();//오늘 미세먼지
                //DataBase에 저장
                //DB_Ref.set(current);
                console.log(current+'\ncurrent');
                console.log('func_get_C_data end');
            }else console.log(err+' err');
        });
    }
/*
exports.UpdateCurrentWthr =  functions.database.ref("/weather/current")
    .onWrite((change,context) =>{
        //data가 전부 삭제된 경우
        if(!change.after.exists())
            return null;
        //데이터를 5분마다 네이버에서 크롤링
        func_get_C_data();
        //setTimeout(func_get_C_data,1000*60);
        return null;
});
*/

 var getIconClass = function(weather) {
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


var push = function() {
   
   firebase.database().ref('/fcmTokens/tokens').once('value',function(allTokens){
      console.log('push sending...');
    let tokens = [];
    var currentTime = new Date();

    // Listing all tokens.   
    if (allTokens.val()) tokens = Object.keys(allTokens.val());

    admin.database().ref('/weather/current').once('value', function(snapshot){    // get current weather
      highest = snapshot.val().condition.temp.highest;    // highest temparature
      lowest = snapshot.val().condition.temp.lowest;      // lowest temparature
      dust = snapshot.val().condition.dust;               // dust
      weather = snapshot.val().temp.weather;              // weather code

      var m_wth;    // appropriate label for weather code
      var m_icon;   // appropriate icon for weather code
      
      if(weather === '32'){
        m_wth = '맑음';   m_icon = '/images/clear.png';
      }
      else if(weather === '26'){
        m_wth = '흐림';   m_icon = '/images/cloudy.png';
      }
      else if(weather === 'rainy'){
        m_wth = '비옴';   m_icon = '/images/cloudy.png';
      }

      console.log('['+m_wth+'] 최고 : ' + highest +'℃, 최저 : '+ lowest + '℃, 미세먼지(보통) : '+dust+'µg/㎥'); // log test

      const message = {   // push message setting
        notification: {
          title: 'Six Sense Weather ',
          body: '['+m_wth+'] 최고 : ' + highest +'℃, 최저 : '+ lowest + '℃,\n미세먼지(보통) : '+dust+'µg/㎥',
          icon: m_icon,
          click_action: 'https://chatweb-5dc1a.firebaseapp.com'
        }
      };

      admin.messaging().sendToDevice(tokens, message);    // send push message to devices
    });
  });
};

exports.PushMessage = functions.database.ref("/fcmTokens/time")
   .onCreate((snapshot, context) => {
    let rule = new schedule.RecurrenceRule();
    rule.second = 30;
    let pushing = schedule.scheduleJob(rule, push);
    return 0;
});