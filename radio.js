// var fs = require('fs');
var jBinary = require('jbinary');

function Radio(info) {
  var self = this;
  self.filename = info.file;
  this.data = {};
  this._binary = {};
  this.typeset = info.typeset;
  this.name = info.name;
  this.vender = info.vender;
  this.model = info.model;
  this.map = dataMapping[info.map];

  ///
  // Read memory data from given file
  ///
  self.load = function(path) {
    var p = $q.defer();

    jBinary.load(path + self.filename, self.typeset, function(err, binary) {
      if (err) {
        p.reject("Unable to load file: " + err);
        return;
      }

      self._binary = binary;
      self.data = self._binary.readAll();
      for (var trans in self.data.transcevers)
        self.data.transcevers[trans].page = 1;
      p.resolve(self);
    });

    return p.promise;
  };

  ///
  // Write memory data to filename
  ///
  self.save = function(filename) {
    if (filename === undefined)
      filename = self.filename;

    self._binary
      .seek(0)
      .writeAll(self.data)
      .saveAs(filename);
  };
}
