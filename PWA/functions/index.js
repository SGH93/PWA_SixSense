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
	
	request(url, (err, res, html) => {
        if (!err) {
            var $ = cheerio.load(html);       
            var d = new Date(); 
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
            DB_Ref.set(current);
        }
    });
}


exports.UpdateCurrentWthr = functions.database.ref("/weather/current")
	.onWrite((change, context) => {
	//data가 전부 삭제된 경우__성민 질문 
	if (!change.after.exists()) return
	//데이터를 1분마다 네이버에서 크롤링
	setTimeout(func_get_C_data, 1000 * 60);
	return 
});

var push = function() {
	
	firebase.database().ref('/fcmTokens/tokens').once('value',function(allTokens){
		
    let tokens = [];
    var currentTime = new Date();

    // Listing all tokens.	
    if (allTokens.val()) tokens = Object.keys(allTokens.val());

    const message = {
      notification: {
        title: 'comeon',
        body: currentTime.getMinutes()+' minutes' + currentTime.getSeconds()+' seconds',
        icon: '/images/partly-cloudy.png'
      }
    };
    firebase.database().ref("/fcmTokens/time").set(message.notification.body);
    admin.messaging().sendToDevice(tokens, message);
  });
};


exports.PushMessage = functions.database.ref("/fcmTokens/time")
	.onCreate((snapshot, context) => {
    let rule = new schedule.RecurrenceRule();
    rule.second = 30;
    let pushing = schedule.scheduleJob(rule, push);
    return 0;
});



/*
exports.sendNotifications = functions.database.ref('/start').onCreate(snapshot => {
  
    // Get the list of device tokens.
    return firebase.database().ref('/fcmTokens').once('value').then(allTokens => {
      if (allTokens.val()) {
        // Listing all tokens.
        tokens = Object.keys(allTokens.val());
  
        setInterval(function() {
          var currentTime = new Date();
          firebase.database().ref('/fcmTokens').once('value',function(allTokens){
            if (allTokens.val()) {
              tokens = Object.keys(allTokens.val());
            }
          });
          const payload2 = {
            notification: {
              title: 'comeon',
              body: currentTime.getMinutes()+' minutes' + currentTime.getSeconds()+' seconds',
              icon: '/images/partly-cloudy2.png'
            }
          };
          //if(currentTime.getSeconds()===0)
          admin.messaging().sendToDevice(tokens, payload2);
        }, 1000*3);
        
        // Send notifications to all tokens.
        return null;
      }
      return {results: []};
    })
  
  });
*/