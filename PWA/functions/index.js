/*eslint prefer-arrow-callback: 0*/
//Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();
//Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
const request = require('request'),
      cheerio = require('cheerio'),
      firebase = require('firebase');

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

var config = {
    apiKey: "AIzaSyAVPBxezvh6qI1iKhTJh3I7xCCfq_8UTDg",
    authDomain: "pwa-sixsense.firebaseapp.com",
    databaseURL: "https://pwa-sixsense.firebaseio.com",
    projectId: "pwa-sixsense",
    storageBucket: "pwa-sixsense.appspot.com",
    messagingSenderId: "870211420843"
}; firebase.initializeApp(config);


var DB_Ref = firebase.database().ref("/weather/current");

var func_get_C_data = function () {
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
    //data가 전부 삭제된 경우
    if (!change.after.exists())
        return null;
    //데이터를 5분마다 네이버에서 크롤링
    setTimeout(func_get_C_data, 1000 * 60);
    return null;
});



// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database.ref('/start').onCreate(snapshot => {
    // Notification details.
    const text = snapshot.val().text;
  
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
  