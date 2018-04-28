var request = require('request'),
    cheerio = require('cheerio');

var url = "https://m.weather.naver.com/";
var today = {"city": "", "C_temperature": "", "Low_temp": "", "High_temp": ""};
var fs = require("fs");
var schedule = require('node-schedule');
var scheduler;
var i=0;

var req_func_obj =
function req_func(){
    request(url, function (err, res, html) {
        if (!err) {
            console.log(i++);
            var $ = cheerio.load(html);       
            
            //크롤링
            var temp = $("div.section_location > a.title._cnLnbLinktoMap > strong")
            today["city"] = temp.text();    //위치

            temp = $("em.degree_code.full"); //현재 온도
            today["C_temperature"] = temp.text();

            temp = $("span.day_low > em.degree_code");
            today["Low_temp"] = temp.text();    //오늘 최저기온

            temp = $("span.day_high > em.degree_code");
            today["High_temp"] = temp.text();   //오늘 최고기온

            var Json_type = JSON.stringify(today, null, "\t");  //JSON -> string
            fs.writeFile('test_json.json', Json_type, 'utf8', function(error){
                //string을 JSON파일에 출력
            });
        }
    });
}

//req_func();
//scheduleJob('/5 * * * * *', function객체)
//매분 5초 마다 
//ex)12시5초, 12시 1분 5초, 12시 2분 5초.....
//function을 전달하지 말고 function 객체를 전달할것.

scheduler = schedule.scheduleJob('/5 * * * * *', req_func_obj);


