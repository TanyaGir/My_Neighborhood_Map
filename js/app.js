// Global variables
var infowindow;
var map;
var marker;
// Create a new blank array for all the listing markers.
var markers = [];
var locations = [ {
    name: 'Royal Palace Amsterdam',
    location: {
        lat: 52.373207,
        lng: 4.891638
    },
}, {
    name: 'Concertgebouw Amsterdam',
    location: {
        lat: 52.3563,
        lng: 4.8791
    }
}, {
    name: 'Bimhuis',
    location: {
        lat: 52.378365,
        lng: 4.913179
    }
}, {
    name: 'Museumplein',
    location: {
        lat: 52.3573,
        lng: 4.8823
    }
}, {
    name: 'Amsterdam Conservatory',
    location: {
        lat: 52.3758,
        lng: 4.9092
    }
}, {
    name: 'University of Amsterdam',
    location: {
        lat: 52.3558,
        lng: 4.9557
    }
} ];

var Location = function( data ) {
    this.name = ko.observable( data.name );
    this.visible = ko.observable( true );
    this.location = ko.observable( data.location );
    this.marker = data.marker;
};

var ViewModel = function() {
    var self = this;
    this.myLocations = ko.observableArray( [] );
    locations.forEach( function( locationItem ) {
        self.myLocations.push( new Location( locationItem ) );
    } );
    this.currentlocation = ko.observable( this.myLocations()[ 0 ] );
    this.markers = ko.observableArray( locations );
    this.filter = ko.observable( "" );
    this.wikipedia = ko.observableArray( [] );
    url = ko.observable( this.currentlocation );
    details = ko.observable( url );

    this.search = function( value ) {
        // remove all the current locations, which removes them from the view
        if ( value ) {
            // filter the markers with the Marker setVisible method
            for ( var x in locations ) {
                if ( locations[ x ].name.toLowerCase()
                    .indexOf( value.toLowerCase() ) >= 0 ) {
                    self.myLocations()[ x ].visible( true );
                    self.myLocations()[ x ].marker.setVisible( true );

                } else {
                    self.myLocations()[ x ].visible( false );
                    self.myLocations()[ x ].marker.setVisible( false );
                }
            }
        } else {
            for ( var y in locations ) {
                if ( locations[ y ].name.toLowerCase()
                    .indexOf( value.toLowerCase() ) >= 0 )
                    self.myLocations()[ y ].visible( true );
                    self.myLocations()[ y ].marker.setVisible( true );
            }
        }
    };
    this.initMap = function() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map( document.getElementById( 'map' ), {
            center: {
                lat: 52.371807,
                lng: 4.896029
            },
            zoom: 13,
            mapTypeControl: false
        } );

        infowindow = new google.maps.InfoWindow();
        // The following group uses the location array to create an array of markers on initialize.
        for ( var i = 0; i < locations.length; i++ ) {
            // Get the position from the location array.
            var position = locations[ i ].location;
            var title = locations[ i ].name;
            // Create a marker per location, and put into markers array.
            marker = new google.maps.Marker( {
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            } );
            // Push the marker to our array of markers.
            markers.push( marker );

            marker.addListener( 'click', self.populateInfoWindow );

            // Push the marker to our array of markers. 
            self.myLocations()[ i ].marker = marker;
        }
    };

    this.populateInfoWindow = function() {
        var marker = this;
        loadData( marker.title );
        // Check to make sure the infowindow is not already opened on this marker.
        if ( infowindow.marker != marker ) {
            infowindow.marker = marker;
            infowindow.setContent( '<div>' + marker.title + '</div>' );
            marker.setAnimation( google.maps.Animation.BOUNCE ); // Bounce marker when list view item is clicked
            //infowindow.open(map, place.marker); // Open info window on correct marker when list item is clicked
            setTimeout( function() {
                marker.setAnimation( null ); // End animation on marker after 2 seconds
            }, 2000 );
            infowindow.open( map, marker );
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener( 'closeclick', function() {
                infowindow.marker = null;
            } );
        }
    };
    //Click on item in list view
    this.listViewClick = function( place ) {
        google.maps.event.trigger( place.marker, 'click' );
    };
};

window.mapError = function( errorMsg, url, lineNumber ) {
    alert( 'Google Maps Failed To Load' );
};

var loadData = function( name ) {

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + name + '&format=json&callback=wikiCallback';

    $.ajax( {
        url: wikiUrl,
        dataType: "jsonp", // jsonp: "callback",
        success: function( response ) {
            viewModel.wikipedia( [] );
            console.log( response );
            var articleList = response[ 1 ];
            for ( var i = 0; i < articleList.length; i++ ) {
                articleStr = articleList[ i ];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;

                viewModel.wikipedia.push( url );
            }
        }
    }).fail(function (jqXHR, textStatus) {
        alert( "failed to get wikipedia resources" );
    });
};

           $("#menu-toggle").click(function(e) {
               e.preventDefault();
               $("#wrapper").toggleClass("toggled");           
           });
var viewModel = new ViewModel();
viewModel.filter.subscribe( viewModel.search );
ko.applyBindings( viewModel );