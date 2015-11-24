'use strict';

var pack = require('../');
var path = require('path');
var tar = require('tar');
var test = require('tap').test;

var ignoredAppRoot = path.join(__dirname, 'fixtures', 'ignored-app');
var ignoredAppFiles = [
  'ignored-app/.gitignore',
  'ignored-app/.npmignore',
  'ignored-app/node_modules/',
  'ignored-app/node_modules/.bin/',
  'ignored-app/node_modules/.bin/foo',
  'ignored-app/node_modules/foo/',
  'ignored-app/node_modules/foo/.gitignore',
  'ignored-app/node_modules/foo/.npmignore',
  'ignored-app/node_modules/foo/cmd.js',
  'ignored-app/node_modules/foo/node_modules/',
  'ignored-app/node_modules/foo/node_modules/bar/',
  'ignored-app/node_modules/foo/node_modules/bar/.gitignore',
  'ignored-app/node_modules/foo/node_modules/bar/.npmignore',
  // this is where bar/.svn/entries would be if it wasn't ignored
  'ignored-app/node_modules/foo/node_modules/bar/index.js',
  'ignored-app/node_modules/foo/node_modules/bar/package.json',
  'ignored-app/node_modules/foo/package.json',
  'ignored-app/package.json',
];

test('returns a tar stream of everything', function(t) {
  visit.paths = [];

  return pack(ignoredAppRoot).pipe(tar.Parse())
    .on('error', t.ifErr)
    .on('entry', visit)
    .on('end', verify);

  function visit(entry) {
    visit.paths.push(entry.path);
  }

  function verify() {
    t.same(visit.paths, ignoredAppFiles, 'all expected paths present');
    t.end();
  }
});
