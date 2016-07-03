var yeasu_ftm400 = require('radios/yeasu/ftm-400');

var fs = require('fs');
var Promise = require('promise');
var hamjs = module.exports;

///
// mapping of all known memory header strings
///
var headers = {
  yeasu_ftm400.fileHeaderAscii : yeasu_ftm400,
}


hamjs.Radio = function( info ) {
  return new Radio(info);
}

///
// Read memory file from data
///
hamjs.loadMemory = function( data ) {
  return new Promise( function( fullfill, reject ) {

  });
};

///
// Read file and determine memory type
///
hamjs.loadMemoryFromFile = function( filename ) {
  return new Promise( function( fullfill, reject ) ){
    fs.readFile( filename, function(err, data) {
      if( err ) {
        reject(err);
        return;
      }

      for( var header in headers )
      {
        var fileHeader = data.toString( 'ascii', 0, header.length );
        if( fileHeader === header )
        {
          var radioType = headers[header];
          var radio = new Radio( radioType );
          fullfill( radio.load( filename ));
        }
      }
    });
  });
};
