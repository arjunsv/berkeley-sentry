// This example creates circles on the map, representing populations in North
// America.
let circleSet = new Set();
var audio = new Audio('ping3.wav');
var homicideAudio = new Audio('homicide.mp3');
var robberyAudio = new Audio('robbery.mp3');
var assaultandbatteryAudio = new Audio('assaultandbattery.mp3');
var burglaryAudio = new Audio('burglary.mp3');
// First, create an object containing LatLng and population for each crime.
var crimemap = {};
var jsonmap = {};

function setIntervalLimited(callback, interval, x) {
  for (var i = 0; i < x; i++) {
    setTimeout(callback, i * interval);
  }
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.8718, lng: -122.2590},
    zoom: 15,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#4C814B'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#4BFF48'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#43B441'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#48AB46'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#3D653C'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6EA56D'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#3D653C'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#3D653C'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      },
      {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#04C6FF'}, {lightness: -45}]
      },
    ]
  });

  function httpGet(theUrl, callBack, id) {
   function callBack(result) {
      result.sort(function(a, b){
      var keyA = new Date(a.eventdt),
          keyB = new Date(b.eventdt);
      // Compare the 2 dates
      if(keyA < keyB) return 1;
      if(keyA > keyB) return -1;
      return 0;
      });
    console.log("request made")
    for (var i=0; i<20; i++) {
      crime = result[i];
      console.log(crime);
      var title = crime.offense + " " + crime.caseno;
      var crimePos = {lat: crime.block_location.coordinates[1], lng: crime.block_location.coordinates[0]};
      crimemap[title] = {center: crimePos};
      jsonmap[title] = crime;
      }
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true ); // false for synchronous request
    xmlHttp.onreadystatechange = function() {
    if (this.responseText && this.status == 200) {
        callBack(JSON.parse(this.responseText));
      }
    }
    xmlHttp.send( null );
}
  httpGet("https://data.cityofberkeley.info/resource/s24d-wsnp.json");
  setInterval(function(){ spawnCircles(crimemap, map);}, 3000);
  setInterval(function(){ httpGet("https://data.cityofberkeley.info/resource/s24d-wsnp.json");}, 10000);
}

function spawnCircles(circlemap, map){
for (var crime in crimemap) {
    if (!circleSet.has(crime)) {
      createCircle(crimemap[crime], map, crime);
      circleSet.add(crime);
      audio.play();
    }
  }
  function createCircle(crimeLoc, map, title) {
    var type = title.split(" ")[0];
    var _radius = 30;
    var direction = 1;
    var growthFactor = 1.0;
    var fillOpacity = 0.3;
    console.log(type);
    switch(type) {
      case 'MURDER':
        var color = '#FF0000';
        _radius = 130;
        homicideAudio.play();
        growthFactor = 3.4;
        break;
      case 'BURGLARY':
        var color = '#FF8900';
        _radius = 50;
        setTimeout(function(){  burglaryAudio.play(); }, 6000);
        growthFactor = 0.85;
        break;
      case 'ASSAULT/BATTERY':
        var color = '#FF2D00';
        _radius = 70;
        growthFactor = 1.7;
        setTimeout(function(){  assaultandbatteryAudio.play(); }, 3000);
        break;
      case 'THEFT':
        var color = '#FFE800';
        break;
      default:
        var color = '#D6FF00';
        growthFactor = 1.02;
        break;
    }
    var rMin = _radius;
    var rMax = _radius;
    var circleOption = {
      center: crimeLoc.center,
      fillColor: color,
      fillOpacity: fillOpacity,
      map: map,
      radius: _radius,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 0.5
    };
    var circle = new google.maps.Circle(circleOption);
    var infowindow = new google.maps.InfoWindow();
    var circleJSON = jsonmap[title];
    console.log(circleJSON);
    var labelText = "<h4>" + circleJSON.offense + "</h4>" + "LOCATION: " + circleJSON.blkaddr + 
                    "<br> DATE: " + circleJSON.eventdt.slice(0,10) + "<br> TIME: " + circleJSON.eventtm;
    google.maps.event.addListener(circle, 'mouseover', function(e) {
      infowindow.setContent(labelText);
      infowindow.setPosition(this.getCenter());
      infowindow.open(map);
      google.maps.event.addListenerOnce(map, 'mousemove', function(e) {
      infowindow.close();
      });
    });
    var circleTimer = setInterval(function() {
      var radius = circle.getRadius();
      if (circleOption.fillOpacity > fillOpacity || circleOption.fillOpacity < 0.1) {
        growthFactor = 1/growthFactor;
      }
      circleOption.fillOpacity *= growthFactor;
      circle.setOptions(circleOption);
    }, 100);
  }
}