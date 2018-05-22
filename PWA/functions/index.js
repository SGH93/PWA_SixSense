/*eslint prefer-arrow-callback: 0*/
var functions = require('firebase-functions');
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

exports.dbWrite = functions.database.ref('/{id}')
.onWrite((change, context) => {

    var url = 'http://m.weather.naver.com/';
    var json = new Object();

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
        
        //change.after.ref.parent.child('channel/item/condition/temp').set(json.C_temperature);
        //change.after.ref.parent.child('label').set(JSON.stringify(json.city));
        
    });

    return true;
 });



