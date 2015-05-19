'use strict';

var _ = require('lodash');
var async = require('async');
var debug = require('debug')('agile-time-box:cli');
var fs = require('fs');
var help = require('./help');
var moment = require('moment');
var path = require('path');
var soundPlayer = require('play-sound');

var players = ['cvlc', 'mplayer', 'afplay', 'mpg123', 'mpg321', 'play'];
var playSound = true;
var soundTrack = path.join(__dirname, '../sounds/alarm.wav');
var splayer;

function playTrack() {
  if(playSound) {
    splayer.play(soundTrack);
  }
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
  var minutes = padLeadingZeros(timeLeft.get('minutes'));
  var seconds = padLeadingZeros(timeLeft.get('seconds'));
  return hours + ':' + minutes + ':' + seconds;
}

function setSoundTrack(track) {
  if(track) {
    if(fs.existsSync(track)) {
      soundTrack = track;
      debug('#1 Sound track set to: %s', soundTrack);
      return;
    }

    var sound = path.join(__dirname, '../sounds', track + '.wav');
    if(fs.existsSync(sound)) {
      soundTrack = sound;
      debug('#2 Sound track set to: %s', soundTrack);
      return;
    }
  }
}

function setPlayer(player) {
  if(player) {
    _.remove(players, function(item) { return item === player; });
    players.unshift(player);
  }
  var options = {
    players: players
  };
  debug('play-sound options: %o', options);
  splayer = soundPlayer(options);
}

function argSetup(argv) {
  if(argv.hasOwnProperty('p') || argv.hasOwnProperty('play')) {
    playSound = !!(argv.p || argv.play);
    debug('playSound set to %s', playSound);
  }

  setSoundTrack(argv.t || argv.track);

  setPlayer(argv.a || argv.app);
}

function jamSounds(done) {
  var files = fs.readdirSync(path.join(__dirname, '../sounds'));
  console.log('About to jam...');
  async.eachSeries(files, function(file, cb){
    console.log('Now playing ' + file);
    splayer.play(path.join(__dirname, '../sounds', file), cb);
  }, function (err){
    if(err) { console.log(err); }
    console.log('We are done jamming!');
    done();
  });

}

function infoArgs(argv) {
  if(argv.h || argv.help) {
    var files = fs.readdirSync(path.join(__dirname, '../sounds')).map(function(file){
      return file.split('.')[0];
    });
    help(files, players);
    return true;
  }

  if(argv.version || argv.v) {
    console.log(require('../package.json').version);
    return true;
  }

  argSetup(argv);

  return false;
}

function execute(argv) {
  if(!argv.s) {
    console.log('Defaulting 15 minutes for starting interval');
  }
  if(!argv.i) {
    console.log('Defaulting 15 minutes for subsequent intervals');
  }

  var firstTime = argv.s || 15;
  var subsequentTimes = argv.i || 15;

  var alarmTime = moment().add(firstTime, 'minutes');

  console.log('Alarm set to ' + firstTime + ' minute(s) and then every ' +
    subsequentTimes + ' minute(s) after that.');
  console.log('First alarm at ' + moment(alarmTime).format('MM/DD/YYYY h:mm:ss'));

  setInterval(function(){
    if(moment() >= alarmTime) {
      console.log('Time Box complete at ' + moment().format('h:mm:ss'));
      playTrack();
      alarmTime = moment().add(subsequentTimes, 'minutes');
      console.log('Next alarm at ' + moment(alarmTime).format('MM/DD/YYYY h:mm:ss'));
    }
    if(argv.l || argv.log) {
      console.log('Time left: ' +
        formattedTimeFromNow(alarmTime) +
        ' (' + moment().from(alarmTime, true) + ')');
    }
  }, 2000);
}

module.exports = function() {
  var argv = require('minimist')(process.argv.slice(2));

  if(infoArgs(argv)) {
    return;
  }

  if(argv.j || argv.jam) {
    jamSounds();
  } else {
    execute(argv);
  }

};
