const Moment = require('moment');
var https = require('https');

exports.generateOPT = function () {
    return Math.floor(1000 + Math.random() * 9000);
};

exports.generateActivationToken = function () {
    const randomstring = require("randomstring");
    return randomstring.generate();
};

exports.convertTo12Hour = function(time) {
    var hours;
    var minutes;
    if(isFloat(time)){
        var time = time.toString().split('.');
        hours = parseInt(time[0],10);
        hours = (hours == 1) ? 0 : hours;
        minutes = parseInt(time[1],10);
        minutes = (minutes < 10) ? minutes*10 : minutes;
    }else{
        hours = (time == 1) ? 0 : time;
        minutes = 0;
    }

    var newTime = null;
    if(minutes < 10) {
        minutes = '0'+minutes;
    }
    if(hours > 12) {
        newTime = hours - 12;
        if(newTime < 10) {
            newTime = '0' + newTime;
        }
        newTime = newTime + ':' + minutes + ' pm';
    } else if(hours == 12){
        newTime = hours;
        newTime = newTime + ':' + minutes + ' pm';
    } else {
        if(hours < 10) {
            hours = '0'+hours;
        }
        newTime = hours + ':' + minutes + ' am';
    }
    return newTime;
};

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
exports.checkRestaurantIsAvailable = function(Unavailability, selectedtime) {
  let response = true;
  if(Unavailability.length > 0){
    for(var i = 0; i < Unavailability.length; i++){
      let date = Moment(Unavailability[i].NotAvailableDate).format("YYYY-MM-DD").toString()
      let startTime = Unavailability[i].StartTime;
      let endTime = Unavailability[i].EndTime;

      let startdate = Moment(date+' '+startTime,'YYYY-MM-DD hh:mm A').valueOf();
      let enddate = Moment(date+' '+endTime,'YYYY-MM-DD hh:mm A').valueOf();

      if(selectedtime >= startdate && selectedtime <= enddate){
        response = false;
      }
    }
  }
  return response;
};
exports.sendSms = function(phone, message, smssettings) {
  if(phone && message){
    message = encodeURI(message);
    smssettings.APIURL = encodeURI(smssettings.APIURL);
    smssettings.Username = encodeURI(smssettings.Username);
    smssettings.Password = encodeURI(smssettings.Password);
    smssettings.Key = encodeURI(smssettings.Key);
    // var req = https.get('https://messaging.ooredoo.qa/bms/soap/Messenger.asmx/HTTP_SendSms?customerID=3735&userName=bdsmsgw&userPassword=Doha%402022&originator=BOOKANDINE&smsText='+message+'&recipientPhone='+phone+'&messageType=Latin&defDate=&blink=false&flash=false&Private=false', function(resp) {
    var req = https.get(smssettings.APIURL+'?customerID='+smssettings.Key+'&userName='+smssettings.Username+'&userPassword='+smssettings.Password+'&originator=BOOKANDINE&smsText='+message+'&recipientPhone='+phone+'&messageType=Latin&defDate=&blink=false&flash=false&Private=false', function(resp) {
      resp.on('data', function(data) {
        console.log( data.toString() );
      });
      // resp.on('error', function(err) {
        //   console.log('Error while reading', err);
        // });

        // resp.pipe(concat(function(buffer) {
          //   var str = buffer.toString();
          //   parser.parseString(str, function(err, result) {
            //     console.log('Finished parsing:', err, result);
            //   });
            // }));

          });
          req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
          });
          req.end();
  }
};
exports.getRestaurantReviewChart = function(reviews) {
  // console.log(reviews);
  let chart = {
    "one_star_users":0, "two_star_users":0, "three_star_users":0, "four_star_users" : 0, "five_star_users" : 0
  };
  if(reviews && reviews.length){
    //Rattuing wise users
    for(var i = 0; i < reviews.length; i++){
      let overAllRating = reviews[i].OverAllRating;
      overAllRating = parseFloat(overAllRating);
      switch(true) {
        case (overAllRating >= 1 && overAllRating < 1.51 ):
          chart['one_star_users'] = chart['one_star_users'] + 1;
          break;
        case (overAllRating > 1.50 && overAllRating < 2.51 ):
          chart['two_star_users'] = chart['two_star_users'] + 1;
          break;
        case (overAllRating > 2.50 && overAllRating < 3.51 ):
          chart['three_star_users'] = chart['three_star_users'] + 1;
          break;
        case (overAllRating > 3.50 && overAllRating < 3.51 ):
          chart['four_star_users'] = chart['four_star_users'] + 1;
          break;
        case (overAllRating > 4.50 && overAllRating <= 5 ):
          chart['five_star_users'] = chart['five_star_users'] + 1;
          break;
      }
    }
    //Users percent
    let totalUsers = reviews.length;
    chart['one_star_users'] = (chart['one_star_users'] * 100) / totalUsers;
    chart['two_star_users'] = (chart['two_star_users'] * 100) / totalUsers;
    chart['three_star_users'] = (chart['three_star_users'] * 100) / totalUsers;
    chart['four_star_users'] = (chart['four_star_users'] * 100) / totalUsers;
    chart['five_star_users'] = (chart['five_star_users'] * 100) / totalUsers;
  }
  return chart;
};
