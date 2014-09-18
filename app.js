/*jshint node:true */

"use strict";

var moment = require('moment');
var player = require('play-sound')({});

function systemBell(times) {
  player.play('../sounds/sfx/intro.wav');
//  play.sound('./sounds/sfx/alarm.wav');
//  play.sound('./sounds/sfx/crinkle.wav');
//  play.sound('./sounds/sfx/flush.wav');
//  play.sound('./sounds/sfx/ding.wav');
}

function padLeadingZeros(textToPad, finalLengthOfText) {
	var result = textToPad.toString();
	while(result.length < finalLengthOfText){
		result = '0' + result;
	}
	return result;
}

function formattedTimeFromNow(futureTime) {
	var timeLeft = moment.duration(moment(futureTime).subtract(moment()));
	var hours = padLeadingZeros(timeLeft.get('hours'), 1);
	var minutes =  padLeadingZeros(timeLeft.get('minutes'));
	var seconds = padLeadingZeros(timeLeft.get('seconds'));
	return hours + ':' + minutes + ':' + seconds;
}

function main() {
	var args = process.argv.slice(2);
	if(args.length == 0) {
		var firstTime =  15;
		console.log('No arguments passed. Assuming an interval of 15 minutes. Usage: node app.js [firstTime] [subsequentTime]');
	} else {
		var firstTime =  args[0];
	}
	var subsequentTimes = (args.length > 1) ? args[1] : firstTime;

	var alarmTime = moment().add(firstTime, 'minutes');

	console.log('Alarm set to ' + firstTime + ' minute(s) and then every ' + subsequentTimes + ' minute(s) after that.');
	console.log('First alarm at ' + moment(alarmTime).format('MM/DD/YYYY h:mm:ss'));

	setInterval(function(){
		if(moment() >= alarmTime) {
			console.log('Time Box complete at ' + moment().format('h:mm:ss'));
			systemBell(1);
			alarmTime = moment().add(subsequentTimes, 'minutes');
			console.log('Next alarm at ' + moment(alarmTime).format('MM/DD/YYYY h:mm:ss'));
		}
		console.log('Time left: ' +
			formattedTimeFromNow(alarmTime) +
			' (' + moment().from(alarmTime,true) + ')');
	}, 2000);
}

main();
