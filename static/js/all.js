var JourneyMap = function(journeyId,markers){

	this.undefinedLocation = "Unknown";

	this.journeyId = journeyId;
	this.markers = markers;
	this.googleMarkers = [];

	this.mapOptions = {
			zoom: 8,
			center: new google.maps.LatLng(this.markers.path[0].latitude,this.markers.path[0].longitude),
			mapTypeId: 'roadmap'
	};

	this.polyOptions = {
			strokeColor: '#001000',
			strokeOpacity: 1.0,
			strokeWeight: 3
	};

	this.geocoder = new google.maps.Geocoder();
	this.map = null;
	this.poly = new google.maps.Polyline(this.polyOptions);
	this.path = null;

	this.addLatLng = function(event) {
		
		var self = this.map;
		
		self.path = self.poly.getPath();
		self.path.push(event.latLng);

		marker = {};
		marker["latitude"] = event.latLng.nb;
		marker["longitude"] = event.latLng.ob;
		
		self.markers["path"].push(marker);
		
		var currentPathLength = self.path.getLength();
		self.MarkerCreaterPlusLocation(event.latLng,currentPathLength);

	}

	this.init = function() {

		this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
		this.poly.setMap(this.map);
		this.drawMap();
		this.map.map = this;
		google.maps.event.addListener(this.map, 'click',this.addLatLng);
	}

	this.drawMap = function(){

		this.path = null;
		this.path = this.poly.getPath();
		for(var i=0;i<this.markers.path.length;i++){
			var markerLatLngObj = new google.maps.LatLng(this.markers.path[i].latitude,this.markers.path[i].longitude);
			this.path.push(markerLatLngObj);
			var currentPathLength = this.path.getLength();
			this.MarkerCreaterPlusLocation(markerLatLngObj,currentPathLength);
		}
	}

	this.MarkerCreaterPlusLocation = function (latLngObj,currentPathLength){

		var location = this.undefinedLocation;
		var self = this;
		this.geocoder.geocode({'latLng': latLngObj}, function(results, status) {
			
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					location = results[1].formatted_address;
					self.addMarker(location,latLngObj,currentPathLength);
				} else {
					self.addMarker(location,latLngObj,currentPathLength);
				}
			} else {
				self.addMarker(location,latLngObj,currentPathLength);
			}
			
		});

	}

	this.addMarker = function(markerLocation,markerLatLngObj,currentPathLength){

		var marker = new google.maps.Marker({
			position: markerLatLngObj,
			title: '#' + currentPathLength + "::" + markerLocation,
			map: this.map
		});

		this.googleMarkers.push(marker);

		var getXY = function mousePos (e) {
			mouseX = e.pageX; 
			mouseY = e.pageY;
		}

		google.maps.event.addListener(marker, 'mouseover', function() {
			document.addEventListener('mousemove', getXY,false);
		});

		google.maps.event.addListener(marker, 'mouseout', function() {
			document.removeEventListener('mousemove', getXY,false);
		});
		
		var self = this;
		google.maps.event.addListener(marker, "dblclick", function() {
			self.deleteMarker(marker);
		});
		
		this.map.panTo(markerLatLngObj);
	}

	this.setAllMap = function() {
		for (var i = 0; i < this.googleMarkers.length; i++) {
			this.googleMarkers[i].setMap(null);
		}
	}
	
	this.deleteMarker = function(marker){

		l = {};
		l["latitude"] = marker.getPosition().nb;
		l["longitude"] = marker.getPosition().ob;
		
		for(var i=0;i<this.markers.path.length;i++){
			if(JSON.stringify(this.markers.path[i]) == JSON.stringify(l)){
			    this.markers.path.splice(i, 1);
				break;
			}
		}
		
		this.poly.setMap(null);
		marker.setMap(null);
		this.setAllMap();

		this.googleMarkers = [];
		this.poly = new google.maps.Polyline(this.polyOptions);

		this.drawMap();
		this.poly.setMap(this.map);
	}

}

var json = {"path":[{"latitude":17.947380678685217,"longitude":78.695068359375},{"latitude":17.340151652399424,"longitude":78.28857421875}]};
var newMap = new JourneyMap(1,json);

google.maps.event.addDomListener(window, 'load', function(){ newMap.init() });
