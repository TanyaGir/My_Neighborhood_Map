// Global variables

var infowindow;
var map;
var markers = [];

var locations=  [
          {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {name: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {name: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];

var Location = function(data) {
  this.name = data.name;
  this.visible = ko.observable(true)
};


var ViewModel = function(){
  var self = this;

     this.myLocations = ko.observableArray();

      locations.forEach(function(location) {
        self.myLocations.push(new Location(location));
      });


      this.markers = ko.observableArray(locations);
      this.address = ko.observable("");
      // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
      this.doSomething = function(clickedLocation) {
        //console.log("click");
      populateInfoWindow(clickedLocation.marker);

      console.log(clickedLocation);
        // use location.marker to open the marker's info window
      };
      this.search = function(value) {
    // remove all the current locations, which removes them from the view
      if (value) {
        //viewModel.myLocations.removeAll();

      //this.mylocations().forEach
      for(var x in locations) {  
        if(locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.myLocations()[x].visible(true);
        } else {
           self.myLocations()[x].visible(false);
        }
      }
    }
  }
};

      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13,
          mapTypeControl: false
        });

        infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].name;

          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          locations[i].marker = marker
          // Create an onclick event to open an infowindow at each marker.
         // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this);
          });
        }
      }
      function populateInfoWindow(marker) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }

var viewModel = new ViewModel();

viewModel.address.subscribe(viewModel.search);

ko.applyBindings(viewModel);

window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};