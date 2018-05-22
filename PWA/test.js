
var request = require('request');
var cheerio = require('cheerio');
var client = require('cheerio-httpcli');


var json = new Object();
var url = 'http://m.weather.naver.com/';

request(url, function (err, response, html) 
{

    
    if(err) throw err

    var $ = cheerio.load(html);       
   
    
    //크롤링
    var temp = $("div.section_location > a.title._cnLnbLinktoMap > strong")
    json.city = temp.text();

    temp = $("em.degree_code.full"); //현재 온도
    json.C_temperature = temp.text();

    temp = $("span.day_low > em.degree_code");
    json.Low_temp = temp.text();   //오늘 최저기온

    temp = $("span.day_high > em.degree_code");
    json.High_temp = temp.text();   //오늘 최고기온

    console.log(json);

   
});





