TTB = new Object();
TTB.Map = null;

var JourneyMap = function(journeyId,markers){

	this.undefinedLocation = "Unknown";

	this.journeyId = journeyId;
	this.markers = markers;
	this.googleMarkers = [];

	if(markers.length == 0){
		this.mapCenter = TTB.latlng;
	}
	else{
		this.mapCenter = new google.maps.LatLng(this.markers[0].latitude,this.markers[0].longitude);
	}

	this.mapOptions = {
			zoom: 15,
			center: this.mapCenter,
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

		var currentPathLength = self.path.getLength();
		self.MarkerCreaterPlusLocation(event.latLng,currentPathLength,null);

	}

	this.init = function() {

		this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
		this.poly.setMap(this.map);
		this.drawMap();
		this.map.map = this;
		google.maps.event.addListener(this.map, 'click',this.addLatLng);
		this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('photobooth'));
	}

	this.drawMap = function(){

		this.path = null;
		this.path = this.poly.getPath();
		for(var i=0;i<this.markers.length;i++){
			var markerLatLngObj = new google.maps.LatLng(this.markers[i].latitude,this.markers[i].longitude);
			this.path.push(markerLatLngObj);
			var currentPathLength = this.path.getLength();
			this.MarkerCreaterPlusLocation(markerLatLngObj,currentPathLength,this.markers[i]);
		}
	}

	this.MarkerCreaterPlusLocation = function (latLngObj,currentPathLength,milestone){

		var location = this.undefinedLocation;
		var self = this;
		this.geocoder.geocode({'latLng': latLngObj}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					location = results[1].formatted_address;
					self.addMarker(location,latLngObj,currentPathLength,milestone);
				} else {
					self.addMarker(location,latLngObj,currentPathLength,milestone);
				}
			} else {
				self.addMarker(location,latLngObj,currentPathLength,milestone);
			}

		});

	}

	this.displayImages = function(milestone){

		var photobooth = document.getElementById('photobooth');
		$("#photobooth").empty();
		$("#photobooth").css("overflow","scroll");

		var div = document.createElement('div');
		div.id = "links";
		var content = '<ul class="thumbnails span4">';
		for(var i=0;i<milestone['attachments'].length;i++){
			content += '<li>';
			
		    content += '<a href="/image/' + milestone['attachments'][i]['image'] + '" title="" data-gallery>' + 
		    '<img src="/image/' + milestone['attachments'][i]['image'] + '" alt="" height="100px" width="150px"/></a>';
			
			content += '</li>';
		}
		content += '</ul>';
		div.innerHTML = content;
		photobooth.appendChild(div);
		
	}

	this.addMarker = function(markerLocation,markerLatLngObj,currentPathLength,milestone){

		var marker = new google.maps.Marker({
			position: markerLatLngObj,
			title: '#' + currentPathLength + "::" + markerLocation,
			map: this.map
		});

		var milestoneId = null;
		if(milestone == null){
			milestoneId = createNewMilestone(this.journeyId,markerLatLngObj.lat(),markerLatLngObj.lng(),markerLocation);
			this.markers.push(getMilestoneInfo(milestoneId));
			milestone = this.markers[this.markers.length - 1];
		}
		else{
			milestoneId = milestone.milestone_id;
		}

		var getXY = function mousePos (e) {
			mouseX = e.pageX; 
			mouseY = e.pageY;
		}

		var self = this;

		google.maps.event.addListener(marker, "click", function() {

			var formName = "new_milestone_attachment_form" + "__" + milestoneId;
			var message = '<form id="' + formName + 
			'" action="/attachment/new" method="POST" enctype="multipart/form-data">' +
			'<input type="file" name="image" id="fileElem" />' +
			'<button id="fileSelect" class="btn">Select Image</button>' +
			'<label class="control-label" for="inputDesc">Write a Story :</label>' +
			'<textarea cols="1000" name="description">' + 
			'</textarea>' +

			'<div class="control-group">' +
			'<div class="controls">' +
			'<button type="submit" value="Add" class="btn btn-primary">Add</button>' + 
			'</div></div>' +
			'</form>';
			var infoWindow = new google.maps.InfoWindow({
				content: message
			});
			infoWindow.open(this.map, marker);

			google.maps.event.addListener(infoWindow, 'domready', function(){

				$("#" + formName).submit(function(e){
					e.preventDefault();
					var attachmentId = createAttachment(milestoneId);
					milestone['attachments'].push(getAttachment(attachmentId));
					$('#' + formName)[0].reset();
					self.displayImages(milestone);
				});

				$("#" + formName + " #fileSelect").click(function(e){
					e.preventDefault();
					$("#" + formName + ' #fileElem').click();
				});

			});

			self.displayImages(milestone);

		});

		self = this;

		google.maps.event.addListener(marker, 'mouseover', function() {
			document.addEventListener('mousemove', getXY,false);
		});

		google.maps.event.addListener(marker, 'mouseout', function() {
			document.removeEventListener('mousemove', getXY,false);
		});

		google.maps.event.addListener(marker, "dblclick", function() {
			self.deleteMarker(marker,milestoneId);
		});

		this.googleMarkers.push(marker);

		this.map.panTo(markerLatLngObj);

	}

	this.setAllMap = function() {
		for (var i = 0; i < this.googleMarkers.length; i++) {
			this.googleMarkers[i].setMap(null);
		}
	}

	this.deleteMarker = function(marker,milestoneId){

		for(var i=0;i<this.markers.length;i++){
			if(this.markers[i]['milestone_id'] == milestoneId){
				this.markers.splice(i, 1);
				break;
			}
		}

		this.poly.setMap(null);
		marker.setMap(null);
		this.setAllMap();
		for (var i = 0; i < this.googleMarkers.length; i++) {
			this.googleMarkers[i].setMap(null);
		}

		this.googleMarkers = [];
		this.poly = new google.maps.Polyline(this.polyOptions);

		this.drawMap();
		this.poly.setMap(this.map);

		deleteMilestone(milestoneId);

	}

}

var newJourney = function(){ 

	var journeyForm = $("#new_journey_form");
	var formData = new FormData($("#new_journey_form")[0]);

	var url = "/journey/new";

	$.ajax({
		url: url,
		type: 'POST',
		data:  formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false
	}).done(function(data) {
		$('body').append('<div id="photobooth"></div>');
		TTB.Map = new JourneyMap(data['journey_id'],[]);
		TTB.Map.init();

		var getUrl = "/journey/get/" + data['journey_id'];;

		$.ajax({
			url: getUrl,
			type: 'GET',
		}).done(function(data) {
			journeyListElement(data['journey']);
		},"json");
	},"json");
}

var deleteJourney = function(journeyId){

	var url = "/journey/delete/" + journeyId;

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		console.log(data);
	},"json");
}

var journeyListElement = function(journey){

	var id = "list__" + journey['journey_id'];
	var popoverId = "pop__" + journey['journey_id'];
	var linkId = id + "__remove";
	var listElement = '<li id="'+ id +
	'"><img style="height:100px; width:100px;" src="/image/' + journey['image'] +'"> ' +
	'<div><div class="lefty">' + 
	'<h3>' + journey['name'] + '</h3>' + 
	'</div>' + 
	'<div class="righty">' + 
	'<a href="#" class="remove" data-toggle="tooltip" id="' + linkId + '" ' +
	'title="Delete this Journey" data-placement="bottom">&times;</a>' +
	'</div></div>' + 
	'<p>' + journey['description'] + '</p>' +
	'<a href="#" class="righty" rel="popover" title="Share this Journey on..." id="' + 
	popoverId + '">Publish</a>' + 
	'</li>';

	//<img src="/img/publish.jpg" style="width:60px; height:40px;" />

	$('#list').append(listElement);

	$('#' + linkId ).click(function() {
		var id = $(this).attr('id');
		id = id.split("__remove")[0];
		var journeyId = id.split("list__")[1];

		BootstrapDialog.confirm('Are you sure?', function(result){
			if(result) {
				$('#' + id).remove();
				deleteJourney(journeyId);
				if(TTB.Map != null){
					if (TTB.Map.journeyId == journeyId){
						TTB.Map = null;
						$('#map-canvas').empty();
					}
				}
			}else {
			}
		});

	});

	$('#' + id ).click(function() {
		var id = $(this).attr('id');
		var journeyId = id.split("list__")[1];
		loadJourney(journeyId);
	});

	$('#' + popoverId).popover({
		html: true,
		trigger: 'manual',
		container: $(this).attr('id'),
		placement: 'right',
		content: function () {
			var journeyId = $(this).attr('id').split("pop__")[1];
			var publishId = 'publish__' + journeyId;
			var content = '<a href="#" id="' + publishId + '" onclick="postBlog(\'' + journeyId + '\')">Publish To Blogger</a>';
			return content;
		}
	}).on("mouseenter", function () {
		var _this = this;
		$(this).popover("show");
		$(this).siblings(".popover").on("mouseleave", function () {
			$(_this).popover('hide');
		});
	}).on("mouseleave", function () {
		var _this = this;
		setTimeout(function () {
			if (!$(".popover:hover").length) {
				$(_this).popover("hide")
			}
		}, 100);
	});


}

var getAllJourneys = function(){

	var url = "/journey/getall";

	$.ajax({
		url: url,
		type: 'GET',
		async: false,
	}).done(function(data) {

		$('#list').empty();

		var journeys = data['journeys'];
		for(var i=0;i<journeys.length;i++){
			journeyListElement(journeys[i]);
		}

	},"json");

}

var loadJourney = function(journeyId){

	var url = "/journey/get/" + journeyId;

	$.ajax({
		url: url,
		async:false,
		type: 'GET',
	}).done(function(data) {
		$('body').append('<div id="photobooth"></div>');
		TTB.Map = new JourneyMap(data['journey']['journey_id'],data['journey']['path']);
		TTB.Map.init();
	},"json");

}

var createNewMilestone = function(journeyId,latitude,longitude,location){

	var url = "/milestone/new";
	var milestoneId = null;

	$.ajax({
		url: url,
		type: 'POST',
		async: false,
		data : {journey_id : journeyId, latitude : latitude, longitude : longitude, location : location }
	}).done(function(data) {
		milestoneId = data['milestone_id'];
	},"json");

	return milestoneId;
}

var deleteMilestone = function(milestoneId){

	var url = "/milestone/delete/" + milestoneId;

	$.ajax({
		url: url,
		type: 'GET',
		async: false,
	}).done(function(data) {
		console.log(data);
	},"json");

}

var getMilestoneInfo = function(milestoneId){

	var url = "/milestone/get/" + milestoneId;
	var milestoneInfo = null;

	$.ajax({
		url: url,
		async:false,
		type: 'GET',
	}).done(function(data) {
		milestoneInfo = data['milestone'];
	},"json");

	return milestoneInfo;
}


var createAttachment = function(milestoneId){

	var url = "/attachment/new";

	var journeyForm = $("#new_milestone_attachment_form" + "__" + milestoneId);
	var formData = new FormData(journeyForm[0]);

	formData.append("milestone_id", milestoneId);

	var attachmentId = null;

	console.log(formData);
	$.ajax({
		url: url,
		type: 'POST',
		data:  formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false
	}).done(function(data) {
		attachmentId = data['attachment_id'];
	},"json");

	return attachmentId;
}

var deleteAttachment = function(attachmentId){

	var url = "/attachment/delete/" + attachmentId;

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		console.log(data);
	},"json");

}

var getAttachment = function(attachmentId){

	var url = "/attachment/get/" + attachmentId;
	var attachmentInfo = null;

	$.ajax({
		url: url,
		async:false,
		type: 'GET',
	}).done(function(data) {
		attachmentInfo = data['attachment'];
	},"json");

	return attachmentInfo;

}


$(document).ready(function() {

	var success = function(position){
		TTB.latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	}

	function error(msg) {
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		error('not supported');
	}

	$("#new_journey_form").submit(function(e){
		e.preventDefault();
		newJourney();
		$("#new_journey_form")[0].reset();
	});

	getAllJourneys();

});
