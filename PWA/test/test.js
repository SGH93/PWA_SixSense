const request   = require('request');
const cheerio   = require('cheerio');


//완성후 수정 정리 
var func_get_C_data = function () {

//	var DB_Ref = firebase.database().ref("/weather");
  var url = "https://m.weather.naver.com/";
  var url2 = "https://weather.naver.com/rgn/townWetr.nhn";


  var weather = {
    "current": {  
      "temp" :{
        "degree": " ",
        "weather": "",
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

	request(url, (err, res, html) => {
    if (!err) {
        var $ = cheerio.load(html);       
        var d = new Date(); 
        var num = 0;
    

     //크롤링
        //temp
          //degree
        var temp = $("em.degree_code.full"); //현재 온도
        weather.current["temp"]["degree"] = temp.text();                
      
        //label
        temp = $("div.section_location > a.title._cnLnbLinktoMap > strong")
        weather.current["temp"]["label"] = temp.text(); //위치

        //time
        weather.current["temp"]["time"] = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString() +"/" + d.getDate().toString() +"   " + 
                                ((d.getUTCHours()+9)%24).toString() +" : " + d.getMinutes().toString() + " : " + d.getSeconds().toString();

          //created
        temp = $("div.card.card_now > span.text.text_location")
        weather.current["temp"]["created"] = temp.text(); // 날씨 발표 시간

     //condition
        //temp:highest
        temp = $("span.day_high > em.degree_code");
        weather.current["condition"]["temp"]["highest"] = temp.text();   //오늘 최고기온

        //temp:lowest
        temp = $("span.day_low > em.degree_code");
        weather.current["condition"]["temp"]["lowest"] = temp.text();    //오늘 최저기온
        
        //temp:sensible
        temp = $("span.day_feel > em.degree_code");
        weather.current["condition"]["temp"]["sensible"] = temp.text();    //오늘 체감기온

        //dust
        temp = $("li.finedust > span > em");
        weather.current["condition"]["dust"] = temp.text();//오늘 미세먼지

       

        //주간 날씨 데이터 크롤링
        $(".weekly_item").each(function(index,item){                
          weather.weekly[num]["day"] = $(this).find('.day').text();   //요일           
            
            if(num === 0 || num === 1){   //날짜
              weather.weekly[num]["date"] = $(this).find('em.sub.type_num').text();   
            }            
            else{
              weather.weekly[num]["date"] = $(this).find('div.weekly_item_date > em.sub').text();
            }
            
            weather.weekly[num]["code"]= $(this).find('div.weekly_item_weather > div:nth-child(1) > div').text();   //날씨 상태
            weather.weekly[num]["low"]= $(this).find('.low > .degree_code').text();     //최저기온
            weather.weekly[num]["high"]= $(this).find('.high > .degree_code').text();   //최고기온
            num++;             
        });
        weather.weekly[0]["date"] = "오늘";

				console.log(JSON.stringify(weather));
    }
  });

	
  request(url2, (err, res, html) =>{  
    //weather
    if(!err){
      var $ = cheerio.load(html);    
			var temp = $("div.fl > em > strong"); //날씨 텍스트
			
			weather.current["temp"]["weather"] = temp.text(); 
			console.log(JSON.stringify(weather.current["temp"]["weather"]));
    }
  });

  //DataBase에 저장
  //DB_Ref.set(weather);
	
}

func_get_C_data();
  