//const functions = require('firebase-functions');
var request = require('request'),
      cheerio = require('cheerio');
      //firebase = require('firebase');

var url = "https://m.weather.naver.com/";


var weekly_temp = [
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

var weekly = [
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""},
    {"date": "","day": "","code": "", "high": "", "low": ""}
]


var current = {

    "temp" :{
        "degree": " ",
        "weather": " ",
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




request(url, function(err, res, html) {
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
        current["temp"]["time"] = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString() +"/" + d.getDate().toString() +"/" + 
                                ((d.getUTCHours()+9)%24).toString() +"/" + d.getMinutes().toString() + "/" + d.getSeconds().toString();

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
        temp = $("li.finedust > span.level2 > em");
        current["condition"]["dust"] = temp.text();//오늘 미세먼지
        
        var num = 0;
        //주간 날씨 데이터 크롤링
        $(".weekly_item").each(function(index,item){              
            weekly_temp[num]["day"] = $(this).find('.day').text();   //요일           
            
            if(num == 0 || num == 1){   //날짜
                weekly_temp[num]["date"] = $(this).find('em.sub.type_num').text();   
            }            
            else{
                weekly_temp[num]["date"] = $(this).find('div.weekly_item_date > em.sub').text();
            }
            
            weekly_temp[num]["code"]= $(this).find('div.weekly_item_weather > div:nth-child(1) > div').text();   //날씨 상태
            weekly_temp[num]["low"]= $(this).find('.low > .degree_code').text();     //최저기온
            weekly_temp[num]["high"]= $(this).find('.high > .degree_code').text();   //최고기온
            num++;             
        });
        weekly_temp[0]["date"] = "오늘";
        

        
        weekly = weekly_temp;
        
        console.log(weekly);
        
        /*
        var num =0;
        testt.each(function(index, item){
            
            var tt = testt.find('.day');
            console.log(tt.text());
            tt = testt.find(".sub");                    
            console.log(tt.text());
        });
        */


        //console.log(JSON.stringify(weekly));

       // temp = $()
        //weekly[0].date = temp.text();

        //DataBase에 저장
       // DB_Ref.set(current);
    }
    else{
        console.log(err);
    }
});


    //console.log(JSON.stringify(current));