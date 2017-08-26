// first goal: display a list with location names using Knockout.js (add the map later)
var locations=  [
          {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
          {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
          {name: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
          {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
          {name: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
          {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
        ];


var ViewModel = function(){
  var self = this;
      this.locations = ko.observableArray(locations);
      this.markers = ko.observableArray(locations);
      this.filter = ko.observable("Bert");

      // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
      this.doSomething = function(locations) {
        //console.log("click");
        console.log(locations);
        // use location.marker to open the marker's info window
      };
  };

// hard coded Array of location objects
// https://github.com/udacity/ud864/blob/master/Project_Code_5_BeingStylish.html#L150
        

// initMap function (later)
      var map;
      // Create a new blank array for all the listing markers.
      var markers = [];
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13,
          mapTypeControl: false
        });

        var largeInfowindow = new google.maps.InfoWindow();
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
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
         // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        }
      }
    
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
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

ko.applyBindings(viewModel);
// https://developers.google.com/maps/documentation/javascript/examples/map-simple

// Location constructor similiar to the Cat constructor form the JavaScript Design Patterns course (optional)

// ViewModel constructor
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models
// In the ViewmModel create an observableArray with location objects
// this.locations = ko.observableArray(locations); // if you do not want to use a Location constructor
// Separating Out the Model video lesson:
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34284402380923
// Adding More Cats video lesson
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34648186930923

// Instantiate the ViewModel
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// The difference between defining the ViewModel as a function expression or defining the viewModel as an object literal:
// https://discussions.udacity.com/t/text-not-updating-with-search-box/182886/6

// Apply the bindings aka activate KO
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models#activating-knockout
