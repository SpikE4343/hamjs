////////////////////////////////////////////////////////////////////////////////
// Yeasu FTM-400 Radio Definition
////////////////////////////////////////////////////////////////////////////////

var jBinary = require('jbinary');
var binarytypes = require('../binarytypes');
var definition = require('../definition');
var common = require('../../common');

var r = module.exports;

///
// Maker of the radio
///
r.vendor = 'Yaesu';

///
// Name of radio type
///
r.model = 'FTM-400';

///
// Memory starting tag. Used to identify save file types
///
r.fileHeaderAscii = 'AH034$';

///
// Transever modem modes
///
r.modes = [ 'FM', 'AM', 'NFM', '', 'WFM' ];

///
// Duplexing modes
///
r.duplexModes = [ '', '', '-', '+', 'split' ];

///
// Custom string encoding for channel labels
///
r.labelEncoding =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
  "!\"#$%&`()*+,-./:;<=>?@[\\]^_`{|}~" +
  "?????? ??????????????????????????????????????????????????????????????????" +
  "?????????????????????????";
r.labelFill = '?';
r.toneModes = [ '', 'Tone', 'TSQL', '-RVT', 'DTCS', '-PR', '-PAG' ];
r.powerModes = [ 'Hi', 'Mid', 'Lo' ];
r.powerValues = [ 50, 20, 5 ];
r.skipModes = [ '', 'S', 'P'];

///
// Defines jBinary typeset data
///
r.map = {
  littleEndian: true,
  rootType: 'Memory',

  includeBaseTypes : {
    'CustomString',
    'BinaryCodedNumber',
    'Enumeration',
    'Boolean'
  }

  types : {

    Frequency : [ 'BinaryCodedNumber', 4, 6, 2 ],

    APRSCallsign: {

    },

    APRSOptions: {

    },

    MainOptions: {
      callsign: {
        label: 'Callsign',
        type:[
        'CustomString', 10,
        'ÿ',
        'ascii'
       ]}
    },

  	Options: {
      main: {
        label: 'Settings',
        type: 'MainOptions'
      },
      aprs: {
        label: 'APRS',
        type:[
          'APRSCallsign',
          'APRSOptions'
        ]
      }
  	},

    Channel: {
      used: {
        label: "Used",
        type: [ 'Boolean', 1],
        show: false
      },
      skip: {
        label: "Skip",
        type: [ 'bitfield', 2]
      },
      unknown1: ['bitfield', 5],
      unknown2: ['bitfield', 1],
      mode: {
        label: "Transceve Mode",
        type: [
          'Enumeration',
          ['bitfield', 3],
          r.modes],
        encoding: r.modes
      },
      unknown3: ['bitfield', 1],
      oddsplit: {
        label: "Odd Split",
        type: 'Boolean',
      },
      duplex: [
        'Enumeration',
        ['bitfield', 3],
        r.duplexModes
      ],
      frequency: 'Frequency',
      unknown4: [ 'bitfield', 1],
      tmode: {
        label: "Tone Mode",
        type:[
          'Enumeration',
          ['bitfield', 3],
          r.toneModes
        ],
        encoding: r.toneModes
      },
      unknown5: [ 'bitfield', 4],
      split: 'Frequency',
      power: {
        label: "Transmit Power",
        type: [
          'Enumeration',
          ['bitfield', 2],
          r.powerModes
        ],
        encoding: r.powerModes
      },
      tone:{
        label: 'Transmit CTCSS Tone',
        type: [
          'Enumeration',
          [ 'bitfield', 6],
          common.ctcssTones
        ],
        encoding: common.ctcssTones
      },
      unknown6: [ 'bitfield', 1],
      dtcs: {
        label: 'Transmit DCS Code'
        type: [
          'Enumeration',
          [ 'bitfield', 7],
          common.dtcsCodes
        ],
        encoding: common.dtcsCodes
      },
      showalpha: {
        label: 'Show Alpha Numeric',
        type: 'Boolean'
      },
      unknown7: [ 'bitfield', 7],
      unknown8: 'uint8',
      offset: {
        label: 'Offset',
        type: 'uint8'
      },
      unknown9: ['array','uint8', 2]
    },

    LabelString : [
      'CustomString', 8,
      r.labelFill,
      r.labelEncoding
    ],

    LabelList: [ 'array', 'LabelString' , 518 ],

    HomeChannel: {
   		channel: 'Channel',
   		label: 'LabelString'
   	},

    Transcever: {
      channels: [ 'array', 'Channel', 518]
    },

    Memory: {
      tag: ['string', 6],
      unknown1: ['blob', 690],
      settings: 'Options',

      unknown2: ['blob', 1342],

      // home: ['array', 'HomeChannel', 2],

      transcevers: ['array', 'Transcever', 2],
      labels: ['array', 'LabelList', 2]
    }
  }
};

r.typeset = definition.createBinaryTypeset( r.map );
