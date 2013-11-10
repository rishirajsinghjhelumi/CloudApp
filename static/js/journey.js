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
		alert(JSON.stringify(data));
	},"json");
}

var deleteJourney = function(journeyId){

	var url = "/journey/delete/" + journeyId;
	
	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");
}

var getAllJourneys = function(){

	var url = "/journey/getall";

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");

}

var loadJourney = function(journeyId){

	var url = "/journey/get/" + journeyId;

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");

}

var createNewMilestone = function(journeyId,latitude,longitude,location){

	var url = "/milestone/new";

	$.ajax({
		url: url,
		type: 'POST',
		data : {journey_id : journeyId, latitude : latitude, longitude : longitude, location : location }
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");

}

var deleteMilestone = function(milestoneId){

	var url = "/milestone/delete/" + milestoneId;

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");

}

var getMilestoneInfo = function(milestoneId){

	var url = "/milestone/get/" + milestoneId;

	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");
}


var createAttachment = function(milestoneId){
	
	var url = "/attachment/new";
	
	var journeyForm = $("#new_milestone_attachment_form");
	var formData = new FormData(journeyForm[0]);
	
	formData.append("milestone_id", milestoneId);
	
	$.ajax({
		url: url,
		type: 'POST',
		data:  formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");
	
}

var deleteAttachment = function(attachmentId){
	
	var url = "/attachment/delete/" + attachmentId;
	
	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");
	
}

var getAttachment = function(attachmentId){
	
	var url = "/attachment/get/" + attachmentId;
	
	$.ajax({
		url: url,
		type: 'GET',
	}).done(function(data) {
		alert(JSON.stringify(data));
	},"json");
	
}