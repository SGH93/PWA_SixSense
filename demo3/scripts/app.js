var request = require("request");  
var cheerio = require("cheerio");  
var url = "https://m.weather.naver.com/";

request(url, function(error, response, body) {  
  if (error) throw error;

  var $ = cheerio.load(body);

  var current_temp = $("em.degree_code.full"); //현재 온도 긁어오기
  
  console.log(current_temp.text());  //콘솔로 확인

});