var cheerio = require('cheerio');
var request = require('request');
var secrets = require('./config/secrets');
var moment = require('moment');
var Event = require('./models/Event');
var mongoose = require('mongoose');


var events =[];
//Challenge Post
// request.get('http://challengepost.com/discover'
//   , function(err, request, body) {
//   if(err)
//     return next(err);
//   var $ = cheerio.load(body);
//    $('article.challenge-listing').each(function(i, element){
//     var event={};
//     var data=$(this);
//     event.type = "Hackathons";
//     event.pic = "https:" + data.children().find('div.large-9 section.challenge-synopsis figure.challenge-logo img').attr('src');
//     event.date = data.children().find('div.large-3 section.stats').children().last().find('div.submission-time div.small-10 span.value').text();
//     event.link = data.children().attr('href');
//     event.name = data.children().find('div.large-9 section.challenge-synopsis div.content h2.title').text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
//     event.tagline = data.children().find('div.large-9 section.challenge-synopsis div.content p.challenge-description').text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
//     events[event.link] = event;
//     require('request').get(event.link, function(err, request, body) {
//       if (err) return next(err);
//       var $ = cheerio.load(body);
//       events[event.link].description = $('article#challenge-description').find('p').text();
//       events[event.link].location = $('div#challenge-information section.location p').text();




//             //  // var prizes=[{
//            //   //   name: String
//            //   // }];
//            //   // $('li.prize').each(function(i,element){
//          //     //   var data=$(this);
//           //    //   prizes[i].name = data.find('h6').text();
//           //    //    // console.log(prizes[i]);
//          //     // });
//           //    // console.log(prizes);



//       var eventdb = new Event({
//                         name: events[event.link].name,
//                         description: events[event.link].description,
//                         tagline: events[event.link].tagline,
//                         date: {
//                             stringDate: events[event.link].date
//                         },
//                         type: events[event.link].type,
//                         location: {
//                             address: events[event.link].location
//                         },
//                         link: events[event.link].link,
//                         pic: events[event.link].pic
//         });
//       eventdb.save(function(err){
//         if(err)
//           console.log(err);
//         else
//           console.log('Added');
//       });
//     });
      

//   });
// });





//Meetups
// request.get('http://www.meetup.com/find/?allMeetups=false&keywords=Hackathons&radius=Infinity&userFreeform=Mumbai%2C+India&mcName=Mumbai%2C+IN&lat=18.975006&lon=72.825806&sort=default'
//   , function(err, request, body) {
//   if(err)
//     return next(err);
//   var $ = cheerio.load(body);
//    $('li.simple-card-li').each(function(i, element){
//     var event={};
//     var data=$(this);
//     event.type = "Meetups";
//     // event.pic = data.children().children().first().children().children().attr('data-original');
//     // event.date = data.children().children().last().text();
//     event.link = data.children().children().first().attr('href');
//     event.name = data.children().children().first().text();
//     //console.log(event.link);
//     events[event.link] = event;
//     require('request').get(event.link, function(err, request, body) {
//       if (err) return next(err);
//       var $ = cheerio.load(body);
//       events[event.link].description = $('div#groupDesc').find('p').text();
//       event.location = $('span.locality').text() + "," + $('span.region').text();
//       //console.log(events[event.link].location);
//       var eventdb = new Event({
//                         name: events[event.link].name,
//                         description: events[event.link].description,
//                         // date: {
//                         //     stringDate: events[event.link].date
//                         // },
//                         type: events[event.link].type,
//                         location: {
//                             address: events[event.link].location
//                         },
//                          link: events[event.link].link
//                         // pic: events[event.link].pic
//         });
//       eventdb.save(function(err){
//         if(err)
//           console.log(err);
//         else
//           console.log('Added');
//       });
//     });
      

//   });
// });

//Angel hack(not functioning)
// request.get('http://www.angelhack.com/events', function(err, request, body) {
//   if(err)
//     return next(err);
//   var $ = cheerio.load(body);
//   $('div.upcoming-global-hackathon-series').each(function(i, element){
//     var event={};
//     var data = $(this);
//     event.type = "Hackathon";
//     event.eventPic = data.children().children().first().attr('data-media');
//     event.link = data.children().children('.work-info').children().attr('href');
//     //console.log(event.link);
//      event.name = data.children().children('.work-info').children('.vert-center').children().text();
//     events[event.link] = event;
//     //console.log(events[event.link]);
//     require('request').get(event.link, function(err, request, body) {
//       if(err) return next(err);
//       var $ = cheerio.load(body);
//       var name = $('div#event_header').find('h1 .summary').text();
//       console.log(name);
      
//     });
//   });

// });


//Hacker league
// request.get('https://www.hackerleague.org/hackathons', function(err, request, body) {
//   if(err)
//     return next(err);
//   var $ = cheerio.load(body);
//   $('div.pending').each(function(i, element){
//     var event={};
//     var data=$(this);
//     event.type = "Hackathon";
//     event.pic = data.children().children().first().children().children().attr('data-original');
//     event.location = data.children().children('.text-uppercase').text();
//     event.date = data.children().children().last().text();
//     event.link = "https://www.hackerleague.org" + data.children().find('h5 a').attr('href');
//     event.name = data.children().find('h5 a').text();
//     events[event.link] = event;
//     require('request').get(event.link, function(err, request, body) {
//       if (err) return next(err);
//       var $ = cheerio.load(body);
//       events[event.link].description = $('div.description').find('p').text();
//       // console.log(events[event.link].date);
//       // events[event.link].date = moment(events[event.link].date);
//       // console.log(events[event.link].date);
//       var eventdb = new Event({
//                         name: events[event.link].name,
//                         description: events[event.link].description,
//                         date: {
//                             stringDate: events[event.link].date
//                         },
//                         type: events[event.link].type,
//                         location: {
//                             address: events[event.link].location
//                         },
//                         link: events[event.link].link,
//                         pic: events[event.link].pic
//         });
//       eventdb.save(function(err){
//         if(err)
//           console.log(err);
//         else
//           console.log('Added');
//       });
//     });
      

//   });
// });





/**
 * Convert 24h to 12h time format.
 */
// function convertTo24h(time) {
//     var hours = Number(time.match(/^(\d+)/)[1]);
//     var minutes = Number(time.match(/:(\d+)/)[1]);
//     var AMPM = time.match(/\s(.*)$/)[1];
//     if (AMPM == "PM" && hours < 12) hours = hours + 12;
//     if (AMPM == "AM" && hours == 12) hours = hours - 12;
//     var sHours = hours.toString();
//     var sMinutes = minutes.toString();
//     if (hours < 10) sHours = "0" + sHours;
//     if (minutes < 10) sMinutes = "0" + sMinutes;
//     return (sHours + ":" + sMinutes);
// }


// /**
//  * 
//  * Web scraping hackathon.io using Cheerio library.
//  */
//Hackaton.io
// request.get('http://www.hackathon.io/', function(err, request, body) {
//     if (err) return next(err);
//     var $ = cheerio.load(body);
//     $(".event-teaser").each(function() {
//         var event = {};
//         event.title = $(this).find('.description h4').text()
//         event.link = $(this).find('.description h4 a').attr('href');
//         event.link = "http://www.hackathon.io" + event.link;
//         event.tagline = $(this).find('.description h5').text();
//         event.location = $(this).find('.location a').text();
//         events[event.link] = event;
//         events[event.link].date = {};
//         event.type = "Hacakathon";
//         require('request').get(event.link, function(err, request, body) {
//             if (err) return next(err);
//             //console.log(events);
//             var $ = cheerio.load(body);
//             var time = $("#head .extras .time").text();
//             time = time.replace(/\r?\n|\r/g, " ");
//             time = time.replace(/\s+/g, ' ').trim();
//             var timezone = time.substring(8, time.length);
//             time = time.substring(0, 8);
//             time = convertTo24h(time);
//             time = time + timezone;
//             var dateAndTime = $("#head .extras .date").text() + " " + time;
//             dateAndTime = dateAndTime.replace(/\r?\n|\r/g, " ");
//             dateAndTime = dateAndTime.replace(/\s+/g, ' ').trim();
//             timezone = timezone.replace(/\s/g, '');
//             events[event.link].date.start = moment(dateAndTime).format();
//             //Get description and rules
//             $(".content .homeright").each(function() {
//                 events[request.request.href].description = $(this).find('.about .js-text-full').text();
//                 events[request.request.href].rules = $(this).find('.rules .js-text-full').text();
//                 //Get the prize
//                 require('request').get(event.link + "/prizes", function(err, request, body) {
//                     if (err) return next(err);
//                     var $ = cheerio.load(body);
//                     var prizes = [];
//                     $("#prizes #table .pane .ten").each(function() {
//                         var prize = {};
//                         prize.name = $(this).find('.prize-title').text();
//                         prize.description = $(this).find('.prize-desc').text();
//                         prizes.push(prize);
//                     });
//                     events[event.link].prizes = prizes;
//                     var eventdb = new Event({
//                         name: events[event.link].title,
//                         description: events[event.link].description,
//                         tagline: events[event.link].tagline,
//                         date: {
//                             start: events[event.link].date.start
//                         },
//                         type: events[event.link].type,
//                         location: {
//                             address: events[event.link].location
//                         },
//                         prizes: events[event.link].prizes,
//                         rules: events[event.link].rules
//                     });
//                     eventdb.save(function(err){
//                       if(err)
//                         console.log(err);
//                     });
//                 });
//                 //end of fetching prizes
//             });
//             //end of fetching description and rules
//         });
//         //end of the single hackathon page
//     });
//     //end of list of upcoming hackathon list
// });
// //end of hackathon.io scan


