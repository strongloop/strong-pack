strong-pack
===========

Simple wrapper for `tar` for packaging a node application, including everything
except version control files (`.git`, `.svn`, `.hg`, etc.). In other words, it
is like `npm pack`, but it does **not** honour `.npmignore` and `.gitignore`.

### Usage

The following example is similar to running `npm pack path/to/app` if npm
ignored all of the normal rules for ignoring/including files.

```js
var fs = require('fs');
var gz = require('zlib').Gzip();
var pack = require('strong-pack');
var tgz = fs.createWriteStream('app.tgz', 'binary');
var appTar = pack('path/to/app');
// using pipe
appTar.pipe(gz).pipe(tgz);
// using pump
var pump = require('pump');
pump(appTar, gz, tgz, function(err) {
  // done! don't forget to check for an error!
});
```

#### Using pump


### License

[Artistic License 2.0](https://opensource.org/licenses/Artistic-2.0)

---
Copyright &copy; 2015, StrongLoop, an IBM Company
