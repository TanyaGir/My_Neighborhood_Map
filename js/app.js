// Global variables
var infowindow;
var map;
var locations = [{
  name: 'Park Ave Penthouse',
  location: {
    lat: 40.7713024,
    lng: -73.9632393
  },
}, {
  name: 'Chelsea Loft',
  location: {
    lat: 40.7444883,
    lng: -73.9949465
  }
}, {
  name: 'Union Square Open Floor Plan',
  location: {
    lat: 40.7347062,
    lng: -73.9895759
  }
}, {
  name: 'East Village Hip Studio',
  location: {
    lat: 40.7281777,
    lng: -73.984377
  }
}, {
  name: 'TriBeCa Artsy Bachelor Pad',
  location: {
    lat: 40.7195264,
    lng: -74.0089934
  }
}, {
  name: 'Chinatown Homey Space',
  location: {
    lat: 40.7180628,
    lng: -73.9961237
  }
}];
var Location = function(data) {
  this.name = ko.observable(data.name);
  this.visible = ko.observable(true);
  this.location = ko.observable(data.location);
  this.marker = data.marker;
};
var ViewModel = function() {
  var self = this;
  this.myLocations = ko.observableArray([]);
  locations.forEach(function(locationItem) {
    self.myLocations.push(new Location(locationItem));
  });
  this.currentlocation = ko.observable(this.myLocations()[0]);
  this.markers = ko.observableArray(locations);
  this.filter = ko.observable("");
  /*
       this.filteredItems = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter) {
        ko.utils.arrayForEach(self.myLocations(), function (item) {
          item.marker.setVisible(true);
        });
        return self.myLocations();
      } else {
        return ko.utils.arrayFilter(self.myLocations(), function(item) {
          // set all markers visible (false)
          var result = (item.title.toLowerCase().search(filter) >= 0);
          item.marker.setVisible(result);
          return result;
        });
      }
    });
  */
  // http://knockoutjs.com/documentation/click-binding.html#note-1-passing-a-current-item-as-a-parameter-to-your-handler-function
  /*  this.doSomething = function(clickedLocation) {
        //console.log("click");
        self.currentlocation(clickedLocation);
        self.populateInfoWindow(clickedLocation.marker);
        //console.log(clickedLocation);
       // console.log(this.populateInfoWindow);
        // use location.marker to open the marker's info window
      }; */
  this.search = function(value) {
    // remove all the current locations, which removes them from the view
    if (value) {
      //viewModel.myLocations.removeAll()
      //this.mylocations().forEach
      // filter the markers with the Marker setVisible method
      for (var x in locations) {
        if (locations[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          self.myLocations()[x].visible(true);
        } else {
          self.myLocations()[x].visible(false);
        }
      }
    } else {
      for (var x in locations) {
        self.myLocations()[x].visible(true);
      }
    }
  };
  this.initMap = function() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 40.7413549,
        lng: -73.9980244
      },
      zoom: 13,
      mapTypeControl: false
    });
    infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    //self.myLocations = locations;
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
      //locations[i].marker = marker;
      self.myLocations()[i].marker = marker;
      // Create an onclick event to open an infowindow at each marker.
      // Push the marker to our array of markers.
      // markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        self.populateInfoWindow(this);
      });
    }
  };
  this.populateInfoWindow = function(marker) {
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
  };
  //Click on item in list view
  this.listViewClick = function(place) {
    self.currentlocation(place);
    self.populateInfoWindow(place.marker);
    if (place.name) {
      //map.setZoom(15); //Zoom map view
      //map.panTo(place.latlng); // Pan to correct marker when list view item is clicked
      place.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce marker when list view item is clicked
      //infowindow.open(map, place.marker); // Open info window on correct marker when list item is clicked
    }
    setTimeout(function() {
      place.marker.setAnimation(null); // End animation on marker after 2 seconds
    }, 2000);
  };
};
//console.log(self.myLocations);
var viewModel = new ViewModel();
viewModel.filter.subscribe(viewModel.search);
ko.applyBindings(viewModel);

function loadData() {
  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text("failed to get wikipedia resources");
  }, 8000);
  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    // jsonp: "callback",
    success: function(response) {
      var articleList = response[1];
      for (var i = 0; i < articleList.length; i++) {
        articleStr = articleList[i];
        var url = 'https://en.wikipedia.org/wiki/' + articleStr;
        $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
      }
      clearTimeout(wikiRequestTimeout);
    }
  });
  return false;
}
$('#form-container').submit(loadData);
window.onerror = function(msg, url, lineNo, columnNo, error) {
  var string = msg.toLowerCase();
  var substring = "script error";
  if (string.indexOf(substring) > -1) {
    //alert('Script Error: See Browser Console for Detail');
  } else {
    var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');
    alert(message);
  }
  return false;
};