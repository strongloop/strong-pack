'use strict';

var debug = require('debug')('strong-pack');
var fstream = require('fstream');
var tar = require('tar');

module.exports = exports = pack;

var FILTER = filterize([
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  /^\.wafpickle-[0-9]+$/,
  /^\..*\.swp$/,
  '.DS_Store',
  /^\._/,
]);

function pack(folder) {
  var tarPack = tar.Pack({ noProprietary: true });
  var contents = fstream.Reader({
    path: folder,
    type: 'Directory',
    isDirectory: true,
    filter: FILTER,
  });
  if (debug.enabled) {
    contents.on('error', debug.bind(null, 'err reading folder'));
    tarPack.on('error', debug.bind(null, 'tar creation error'));
  }
  return contents.pipe(tarPack);
}

function filterize(patterns) {
  patterns = patterns.map(testable);
  return filter;
  function filter(entry) {
    var basename = entry.basename;
    return !patterns.some(function(p) { return p.test(basename); });
  }
  function testable(pattern) {
    if (pattern instanceof RegExp) {
      return pattern;
    }
    return new RegExp('^' + pattern + '$');
  }
}
