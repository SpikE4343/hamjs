var jBinary = require('jbinary');
var binarytypes = require('../binarytypes.js');
var definition = require('../definition.js');

var r = module.exports;

r.vendor = 'Yaesu';
r.model = 'FTM-400';
r.fileHeaderAscii = 'AH034$';

r.modes = [ "FM", "AM", "NFM", "", "WFM" ];
r.duplexes = [ "", "", "-", "+", "split" ];
r.labelEncoding = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????";
r.labelFill = '?';

r.map = {
  binaryLayout: {
    memory: {
      tag: ['string', 6],
      unknown1: ['blob', 690],
      settings: 'Options',

      unknown2: ['blob', 1342],

      // home: ['array', 'home', 2],
      //radio0: 'channel',
      //label0: 'label',
      //radio1: 'channel',
      //label1: 'label',

      transcevers: ['array', 'Transcever', 2],
      labels: ['array', 'LabelList', 2]
    },

    Transcever: {
      channels: [ 'array', 'Channel', 518]
    },

  }

  Channel: {
    size: 16,
    fields: [
      {
        name: 'used',
        label: "Used",
        type: [ 'bitfield', 1],
        encoding: "bool",
        show: false
      },
      {
        name: 'skip',
        label: "Skip",
        type: ['bitfield', 2],
      },
      {
        name: 'unknown1',
        type: ['bitfield', 5],
        show: false
      },
      {
        name: 'unknown2',
        type: ['bitfield', 1],
        show: false
      },
      {
        name: 'mode',
        label: "Mode",
        type: [
          'Enumeration',
          ['bitfield', 3],
          r.modes],
        encoding: r.modes
      },
      {
        name: 'unknown3',
        type: ['bitfield', 1],
        show: false
      },
      {
        name: 'oddsplit',
        label: "Odd Split",
        type: ['bitfield', 1],
        encoding: "bool"
      },
      {
        name: 'duplex',
        label: "Duplex",
        type: [
          'Enumeration',
          ['bitfield', 3],
          r.duplexes
        ],
        encoding: r.duplexes
      },
      {
        name: 'frequency',
        label: "Frequency",
        units: "Mhz",
        type: [ 'Frequency', 6 ]
      }
      power: {
        label: "Power",
      },
      offset: {
        label: "Offset"
      },
      tmode: {
        label: "TMode"
      },
      tone: {
        label: "Tone"
      },
      dtcs: {
        label: "DTCS"
      },


      oddsplit: {
        label: "Odd Split",
        encoding: "bool"
      },
      showalpha: {
        label: "Show Alpha",
        encoding: "bool"
      },
      split: {
        label: "Split",
        units: "Mhz",
        encoding: "Frequency"
      }
    ]
  }
};

r.typeset = {
    'jBinary.littleEndian': true,
    'jBinary.all': 'memory',

    Frequency: jBinary.Type({
      params: ['size'],
      read: function(){
        var value = this.binary.read( ['array', ['bitfield', 4], this.size]  );

        var s = value.length - 1;
        var base = 0.01;
        var output = 0.0;
        for (var i = s; i >= 0; --i)
        {
          output += value[i] * base;
          base *= 10;
        }

        return output;
      },

      write: function(value){
        var num = value / 100;
        var output = [];
        for (var i = 0; i < this.size; ++i)
        {
          output.unshift( num % 10 );
          num /= 10;
        }

        this.binary.write( ['array', ['bitfield', 4] ], output );
      }
    }),

    CustomString: jBinary.Type({
      params: [ 'size', 'fill', 'encoding'],
      // read and decode string
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
        for(var i=0; i < value.length; ++i) {
          var char = value.charAt(i);
          if( char == this.fill)
            break;

          output.push(
            this.encoding.indexOf(char));
        }

        this.binary.write( ['array', 'uint8', this.size ], output );
      }
    }),

    // string <-> int
    Enumeration : jBinary.Type({
      params: [ 'itemType', 'names'],
      resolve: function (getType) {
        this.itemType = getType(this.itemType);
      },
      // read and decode
      read: function(){
        var value = this.binary.read( this.itemType );
        return this.names[value];
      },
      // encode and write
      write: function(value){
        var output = names.indexOf(value);
        this.binary.write( this.itemType, output );
      }
    }),

    channel: {
  // uint8
      used: [ 'bitfield', 1],
      skip: [ 'bitfield', 2],
      unknown1: ['bitfield', 5],
  // uint8
      unknown2: ['bitfield', 1],
      mode: [
        'Enumeration',
        ['bitfield', 3],
        [ "FM", "AM", "NFM", "", "WFM" ]
      ],
      unknown3: ['bitfield', 1],
      oddsplit: ['bitfield', 1],
      duplex: [
        'Enumeration',
        ['bitfield', 3],
        [ "", "", "-", "+", "split" ]
      ],
  // uint8 * 3
      frequency: ['Frequency', 6 ],
  // uint8
      unknown4: [ 'bitfield', 1],
      tmode: [
        'Enumeration',
        ['bitfield', 3],
        [ "", "Tone", "TSQL", "-RVT", "DTCS", "-PR", "-PAG" ]
      ],
      unknown5: [ 'bitfield', 4],
  // uint8 * 3
      split: ['Frequency', 6 ],
  // uint8
      power: [
        'Enumeration',
        ['bitfield', 2],
        [ "Hi", "Mid", "Low" ]
      ],
      tone: [ 'bitfield', 6],
  // uint8
      unknown6: [ 'bitfield', 1],
      dtcs: [ 'bitfield', 7],
  // uint8
      showalpha: [ 'bitfield', 1],
      unknown7: [ 'bitfield', 7],
  // unit8
      unknown8: 'uint8',
      offset: 'uint8',
      unknown9: ['array','uint8', 2]
    },

  	transcever: {
  		channels: [ 'array', 'channel', 518]
  	},

  	labellist: [ 'array', [
      'LabelString', 8,
      '?',
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~?????? ???????????????????????????????????????????????????????????????????????????????????????????"
     ], 518 ],

  	home: {
  		channel: 'channel',
  		label: 'labellist'
  	},

    aprsCallsign: {

    },

    aprsOptions: {

    },

    main_options: {
      callsign: [
        'LabelString', 10,
        'ÿ',
        'ascii'
       ]
    },

  	options: {
      Main: 'main_options',
      APRS: [
        'aprsCallsign',
        'aprsOptions'
      ]
  	},

  	memory: {
  		tag: ['string', 6],
      unknown1: ['blob', 690],
      settings: 'options',

  		unknown2: ['blob', 1342],

  		// home: ['array', 'home', 2],
      //radio0: 'channel',
      //label0: 'label',
      //radio1: 'channel',
      //label1: 'label',

  		transcevers: ['array', 'transcever', 2],
      labels: ['array', 'labellist', 2]
  	}
  }
};
