var jBinary = require('jbinary');

var lib = module.exports;

///
// BCD real number
///
lib.BinaryCodedNumber = jBinary.Type({
  params: [
    'itemBitSize', // number of bits of a single digit when reading/writing
    'length', // count of itemBitSize elements to read/write
    'precision' // digits after decimal point to include when decoding/encoding
  ],
  read: function(){
    var value = this.binary.read( [
      'array',
      ['bitfield', this.itemBitSize],
      this.size
    ]);

    var s = value.length - 1;
    var base = 1.0 / Math.pow( 10, this.precision );
    var output = 0.0;
    for (var i = s; i >= 0; --i)
    {
      output += value[i] * base;
      base *= 10;
    }

    return output;
  },

  write: function(value){
    var num = value / Math.pow( 10, this.precision );
    var output = [];
    for (var i = 0; i < this.size; ++i)
    {
      output.unshift( num % 10 );
      num /= 10;
    }

    this.binary.write([
      'array',
      ['bitfield', this.itemBitSize]
    ], output );
  }
});

///
// Read/Write string of characters with given encoding string
///
lib.CustomString = jBinary.Type({
  params: [ 'size', 'fill', 'encoding'],

  read: function(){
    var value = this.binary.read( ['array', 'uint8', this.size ] );

    var output = "";
    for(var i=0; i < value.length; ++i) {
      var char = value[i];
      if( char === this.fill)
        break;

      if( this.encoding === 'ascii')
        output += String.fromCharCode( char );
      else
        output += this.encoding.charAt(char);
    }

    return output;
  },

  write: function(value){
    var output = [];
    for(var i=0; i < this.size; ++i) {
      if( i < value.length ) {
        var char = value.charAt(i);
        output.push( this.encoding.indexOf(char));
        continue;
      }

      output.push( this.fill );
    }

    this.binary.write( ['array', 'uint8', this.size ], output );
  }
});

///
// string <-> int
///
lib.Enumeration : jBinary.Type({
  params: [
    'itemType', // basically only integers
    'names'
  ],

  resolve: function (getType) {
    this.itemType = getType(this.itemType);
  },

  read: function(){
    var value = this.binary.read( this.itemType );
    return this.names[value];
  },

  write: function(value){
    var output = names.indexOf(value);
    this.binary.write( this.itemType, output );
  }
}),
