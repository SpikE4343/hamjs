var yeasu_ftm400dr = require('radios/yeasu/ftm400dr.js');

var fs = require('fs');
var Promise = require('promise');
var hamjs = module.exports;

///
// mapping of all known memory header strings
///
var headers = {
  yeasu_ftm400dr.fileHeaderAscii : yeasu_ftm400dr,
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

//# 50 Tones
hamjs.ctcssTones = [
  67.0, 69.3, 71.9, 74.4, 77.0, 79.7, 82.5,
  85.4, 88.5, 91.5, 94.8, 97.4, 100.0, 103.5,
  107.2, 110.9, 114.8, 118.8, 123.0, 127.3,
  131.8, 136.5, 141.3, 146.2, 151.4, 156.7,
  159.8, 162.2, 165.5, 167.9, 171.3, 173.8,
  177.3, 179.9, 183.5, 186.2, 189.9, 192.8,
  196.6, 199.5, 203.5, 206.5, 210.7, 218.1,
  225.7, 229.1, 233.6, 241.8, 250.3, 254.1
];

//var TONES_EXTR = [62.5]

//OLD_TONES = list(TONES)
//[OLD_TONES.remove(x) for x in [159.8, 165.5, 171.3, 177.3, 183.5, 189.9,
//                               196.6, 199.5, 206.5, 229.1, 254.1]]

// # 104 DTCS Codes
hamjs.dtcsCodes = [
    23,  25,  26,  31,  32,  36,  43,  47,  51,  53,  54,
    65,  71,  72,  73,  74,  114, 115, 116, 122, 125, 131,
    132, 134, 143, 145, 152, 155, 156, 162, 165, 172, 174,
    205, 212, 223, 225, 226, 243, 244, 245, 246, 251, 252,
    255, 261, 263, 265, 266, 271, 274, 306, 311, 315, 325,
    331, 332, 343, 346, 351, 356, 364, 365, 371, 411, 412,
    413, 423, 431, 432, 445, 446, 452, 454, 455, 462, 464,
    465, 466, 503, 506, 516, 523, 526, 532, 546, 565, 606,
    612, 624, 627, 631, 632, 654, 662, 664, 703, 712, 723,
    731, 732, 734, 743, 754
];

//# 512 Possible DTCS Codes
// ALL_DTCS_CODES = []
// for a in range(0, 8):
//     for b in range(0, 8):
//         for c in range(0, 8):
//             ALL_DTCS_CODES.append((a * 100) + (b * 10) + c)
//
// var CROSS_MODES = [
//     "Tone->Tone",
//     "DTCS->",
//     "->DTCS",
//     "Tone->DTCS",
//     "DTCS->Tone",
//     "->Tone",
//     "DTCS->DTCS",
//     "Tone->"
// ]

hamjs.modes = [
  "WFM",
  "FM",
  "NFM",
  "AM",
  "NAM",
  "DV",
  "USB",
  "LSB",
  "CW",
  "RTTY",
  "DIG",
  "PKT",
  "NCW",
  "NCWR",
  "CWR",
  "P25",
  "Auto",
  "RTTYR",
  "FSK",
  "FSKR"
];

hamjs.toneModes = [
    "",
    "Tone",
    "TSQL",
    "DTCS",
    "DTCS-R",
    "TSQL-R",
    "Cross"
];

hamjs.tuningSteps = [
    5.0, 6.25, 10.0, 12.5, 15.0, 20.0, 25.0, 30.0, 50.0, 100.0,
    125.0, 200.0,
    // Need to fix drivers using this list as an index!
    9.0, 1.0, 2.5
];

hamjs.skipValues: ["", "S", "P"];

hamjs.aprs = {
//# http://aprs.org/aprs11/SSIDs.txt
    ssid: [
      "0 Your primary station usually fixed and message capable",
      "1 generic additional station, digi, mobile, wx, etc",
      "2 generic additional station, digi, mobile, wx, etc",
      "3 generic additional station, digi, mobile, wx, etc",
      "4 generic additional station, digi, mobile, wx, etc",
      "5 Other networks (Dstar, Iphones, Androids, Blackberry's etc)",
      "6 Special activity, Satellite ops, camping or 6 meters, etc",
      "7 walkie talkies, HT's or other human portable",
      "8 boats, sailboats, RV's or second main mobile",
      "9 Primary Mobile (usually message capable)",
      "10 internet, Igates, echolink, winlink, AVRS, APRN, etc",
      "11 balloons, aircraft, spacecraft, etc",
      "12 APRStt, DTMF, RFID, devices, one-way trackers*, etc",
      "13 Weather stations",
      "14 Truckers or generally full time drivers",
      "15 generic additional station, digi, mobile, wx, etc"
    ],

    positionComment: [
      "off duty", "en route", "in service", "returning", "committed",
      "special", "priority", "custom 0", "custom 1", "custom 2", "custom 3",
      "custom 4", "custom 5", "custom 6", "EMERGENCY"],

//# http://aprs.org/symbols/symbolsX.txt
// TODO: find some icons
//       add string codes
    symbols: [
      "Police/Sheriff", "[reserved]", "Digi", "Phone", "DX Cluster",
      "HF Gateway", "Small Aircraft", "Mobile Satellite Groundstation",
      "Wheelchair", "Snowmobile", "Red Cross", "Boy Scouts", "House QTH (VHF)",
      "X", "Red Dot", "0 in Circle", "1 in Circle", "2 in Circle",
      "3 in Circle", "4 in Circle", "5 in Circle", "6 in Circle", "7 in Circle",
      "8 in Circle", "9 in Circle", "Fire", "Campground", "Motorcycle",
      "Railroad Engine", "Car", "File Server", "Hurricane Future Prediction",
      "Aid Station", "BBS or PBBS", "Canoe", "[reserved]", "Eyeball",
      "Tractor/Farm Vehicle", "Grid Square", "Hotel", "TCP/IP", "[reserved]",
      "School", "PC User", "MacAPRS", "NTS Station", "Balloon", "Police", "TBD",
      "Recreational Vehicle", "Space Shuttle", "SSTV", "Bus", "ATV",
      "National WX Service Site", "Helicopter", "Yacht/Sail Boat", "WinAPRS",
      "Human/Person", "Triangle", "Mail/Postoffice", "Large Aircraft",
      "WX Station", "Dish Antenna", "Ambulance", "Bicycle",
      "Incident Command Post", "Dual Garage/Fire Dept", "Horse/Equestrian",
      "Fire Truck", "Glider", "Hospital", "IOTA", "Jeep", "Truck", "Laptop",
      "Mic-Repeater", "Node", "Emergency Operations Center", "Rover (dog)",
      "Grid Square above 128m", "Repeater", "Ship/Power Boat", "Truck Stop",
      "Truck (18 wheeler)", "Van", "Water Station", "X-APRS", "Yagi at QTH",
      "TDB", "[reserved]"
    ]
  }
};
