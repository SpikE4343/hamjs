var binarytypes = require('binarytypes');

var lib = module.exports;

///
// Create jBinary typeset object from radio map object
///
lib.createBinaryTypeset = function( map ) {
  var typeset = {};

  typeset['jBinary.littleEndian'] = map.littleEndian;
  typeset['jBinary.all'] = map.rootType;

  for( var i =0; i < map.includeBaseTypes.length; ++i) {
    var name  map.includeBaseTypes[i];
    typeset[name] = binarytypes[name];
  }

  for( var name in map.types ) {
    var typeDef = map.types[name];
    if( typeof( typeDef ) == 'Object' )
    {
      typeset[name] = typeDef.type;
      continue;
    }

    typeset[name] = typeDef;
  }

  return typeset;
};
