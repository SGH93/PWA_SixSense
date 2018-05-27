/*eslint prefer-arrow-callback: 0*/
//Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
//Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
const request   = require('request');
const cheerio   = require('cheerio');
const firebase  = require('firebase');
const schedule  = require('node-schedule');
admin.initializeApp();


var config = {
	apiKey: "AIzaSyAVPBxezvh6qI1iKhTJh3I7xCCfq_8UTDg",
	authDomain: "pwa-sixsense.firebaseapp.com",
	databaseURL: "https://pwa-sixsense.firebaseio.com",
	projectId: "pwa-sixsense",
	storageBucket: "pwa-sixsense.appspot.com",
	messagingSenderId: "870211420843"
}; firebase.initializeApp(config);

//완성후 수정 정리 
var func_get_C_data = function () {
	var url = "https://m.weather.naver.com/";

	var weather = {
    "current": {  
      "temp" :{
        "degree": " ",
        "weather": "뇌우",
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
    },
    "weekly": [
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""},
      {"date": "","day": "","code": "", "high": "", "low": ""}
    ]
	};

	var DB_Ref = firebase.database().ref("/weather");
	
	request(url, (err, res, html) => {
    if (!err) {
        var $ = cheerio.load(html);       
        var d = new Date(); 
        var weekly = weather.weekly;
        var num = 0;
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
        current["temp"]["time"] = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString() +"/" + d.getDate().toString() +"   " + 
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
        temp = $("li.finedust > span > em");
        current["condition"]["dust"] = temp.text();//오늘 미세먼지

       

        //주간 날씨 데이터 크롤링
        $(".weekly_item").each(function(index,item){                
          weekly[num]["day"] = $(this).find('.day').text();   //요일           
            
            if(num === 0 || num === 1){   //날짜
                weekly[num]["date"] = $(this).find('em.sub.type_num').text();   
            }            
            else{
                weekly[num]["date"] = $(this).find('div.weekly_item_date > em.sub').text();
            }
            
            weekly[num]["code"]= $(this).find('div.weekly_item_weather > div:nth-child(1) > div').text();   //날씨 상태
            weekly[num]["low"]= $(this).find('.low > .degree_code').text();     //최저기온
            weekly[num]["high"]= $(this).find('.high > .degree_code').text();   //최고기온
            num++;             
        });
        weekly[0]["date"] = "오늘";
        
        //DataBase에 저장
        DB_Ref.set(weather);
    }
  });
}


var getIconClass = function(weather) {
  switch (weather) {
    case '맑음': 
      return 'clear';
    case '비':
      return 'rain';
    case '뇌우': 
    case '흐려져뇌우':
      return 'thunderstorm'
    case '소낙눈':  
    case '흐려져눈':  
      return 'snow';
    case '안개': 
      return 'fog';
      //return 'windy';
    case '흐림': 
    case '흐려짐': 
    case '구름많음':
      return 'cloudy';
    case '구름조금':  
      return 'partly-cloudy';
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
  return null;
};

var push = function() {
  firebase.database().ref('/').once('value',function(snapshot){
    console.log('push sending...');
    let tokens = [];

    // Listing all tokens.   
    if (allTokens.val()) tokens = Object.keys(snapshot.val().fcmTokens.tokens);
    else return null;

    // get current weather
    let highest = snapshot.val().condition.temp.highest;    // highest temparature
    let lowest = snapshot.val().condition.temp.lowest;      // lowest temparature
    let dust = snapshot.val().condition.dust;               // dust
    let weather = snapshot.val().temp.weather;              // weather code
    
    if(dust<=30)
      dust_state = '좋음';
    else if(dust>30 && dust<=80)
      dust_state = '보통';
    else if(dust>80 && dust<=150)
      dust_state = '나쁨';
    else if(dust>150)
      dust_state = '매우나쁨';

    // appropriate icon for weather code  
    let m_icon = '/images/' + getIconClass(weather) + '.png'; 
    let message_body = '['+weather+'] 최고 : ' + highest +'℃, 최저 : ' + lowest
                            + '℃,\n미세먼지(' + dust_state + ') : '+dust+'µg/㎥';

    console.log('['+ weather +'] 최고 : ' + highest +'℃, 최저 : '+ lowest + '℃, 미세먼지(보통) : '+dust+'µg/㎥'); // log test

    const message = {   // push message setting
      notification: {
        title: 'Six Sense Weather ',
        body: message_body,
        icon: m_icon,
        click_action: 'https://pwa-sixsense.firebaseapp.com/'
      }
    };

    //확인용 
    firebase.database().ref("/fcmTokens/time").set(message.notification.body);
    return admin.messaging().sendToDevice(tokens, message);    // send push message to devices
   });
};




exports.PushMessage = functions.database.ref("/fcmTokens/time")
	.onCreate((snapshot, context) => {
    let rule = new schedule.RecurrenceRule();
    rule.second = 30;
    let pushing = schedule.scheduleJob(rule, push);
    return 0;
});


exports.UpdateCurrentWthr = functions.database.ref("/weather/current")
	.onWrite((change, context) => {
	//data가 전부 삭제된 경우__성민 질문 
	if (!change.after.exists()) return null;
	//데이터를 1분마다 네이버에서 크롤링
	setTimeout(func_get_C_data, 1000 * 60);
	return null;
});
