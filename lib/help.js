'use strict';

module.exports = function(tracks, players) {
  var help =
    '\n  Usage: timebox [options]' +
    '\n' +
    '\n  Options:' +
    '\n' +
    '\n    -h, --help       output usage information' +
    '\n    -v, --version    output the version number' +
    '\n    -s, --start      first interval - default 15 minutes' +
    '\n    -i, --interval   subsequent intervals - default 15 minutes' +
    '\n    -l, --log        log progress - default 0, set to 1 to show' +
    '\n    -p, --play       play sound - default 1, set to 0 to suppress sound' +
    '\n    -t, --track      sound track to play - default \'alarm\' - all tracks:' +
    '\n                     ' + tracks.toString() +
    '\n    -a, --app        audio player - defaults to first found on list:' +
    '\n                     ' + players.toString() +
    '\n';
  console.log(help);
};
