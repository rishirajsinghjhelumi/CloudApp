var newUser;

var newBlogDetails = function(journeyId){
	this.accessToken;
	this.journeyId = journeyId;
	this.journeyDetails;
	this.journeyMilestones;
	this.error = null;
	this.blogDetails = [];
	this.verifyAccessToken = function(){
		self = this;
		var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+this.accessToken;
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			error: function(data) {
					console.log("DTATAAA");
					console.log(data['responseText']);
				    var obj = $.parseJSON(data['responseText']);
					self.error = obj['error'];
					console.log(self.error);
			},
		}).done(function(data) {
			console.log(data);
		},"json");
	};
	
	this.getAccessToken = function(){
		self = this;
		var url = "/user/getAccessToken";
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
		}).done(function(data) {
			console.log(data);
			self.accessToken = data['access_token'];
		},"json");
	};
	
	this.loadJourney = function(){
		self = this;
		var url = "/journey/get/" + this.journeyId;

		$.ajax({
			url: url,
			async:false,
			type: 'GET',
		}).done(function(data) {
			self.journeyDetails = data['journey'];
		},"json");

	};

	this.postJourney = function(){
		self=this;
		console.log(self.accessToken);
		var currBlog = this.blogDetails[0];
		var journeyDate = new Date( this.journeyDetails['time'] *1000);
		var url = "https://www.googleapis.com/blogger/v3/blogs/" +currBlog["id"]+"/posts/";
		var longString = "{'kind':'blogger#post'  , 'blog': {'id':  " + currBlog['id'] + " }, \
						 'title': '" + this.journeyDetails["name"] + "', 'content': '"+this.journeyDetails['description']+" <br><br> Dated : <b>"+journeyDate+"<b><br>'  ,  \
			'image': { 'url': 'http://1.bp.blogspot.com/-dmCxXMKIIa0/Uid4grOEDSI/AAAAAAAADzk/nhzmCUTJhZs/s320/Bliss-Windows-XP.png' } } ";
		$.ajax({
			url: url,
			async:false,
			type: 'POST',
			data: longString,
			beforeSend: function (request)
			{
				request.setRequestHeader("Authorization","Bearer "+self.accessToken);
				request.setRequestHeader("Content-Type","application/json");
			},
		}).done(function(data) {
			console.log(data);
		});
		for(var i = 0 ; i<this.journeyDetails['path'].length; ++i ){
			var journeyDate = new Date( this.journeyDetails['path'][i]['time'] *1000);
			var url = "https://www.googleapis.com/blogger/v3/blogs/" +currBlog["id"]+"/posts/";
			var longString = "{'kind':'blogger#post'  , 'blog': {'id':  " + currBlog['id'] + " }, \
							 'title': '<b>" + this.journeyDetails['path'][i]['location'] + "<b>', 'content': '"+this.journeyDetails['path'][i]['description']+" <br><br> Dated : <b>"+journeyDate+"<b><br>'  ,  \
				'image': { 'url': 'http://1.bp.blogspot.com/-dmCxXMKIIa0/Uid4grOEDSI/AAAAAAAADzk/nhzmCUTJhZs/s320/Bliss-Windows-XP.png' } } ";
			$.ajax({
				url: url,
				async:false,
				type: 'POST',
				data: longString,
				beforeSend: function (request)
				{
					request.setRequestHeader("Authorization","Bearer "+self.accessToken);
					request.setRequestHeader("Content-Type","application/json");
				},
			}).done(function(data) {
				console.log(data);
			});
		}
	};
	
	
	
	
	
	
	this.getUserDetail = function(){
		var url = "https://www.googleapis.com/blogger/v3/users/self";
		self = this;
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			beforeSend: function (request)
			{
				//request.setRequestHeader("Authorization","Bearer ya29.1.AADtN_VXVsrqd4u-ccW2wMOZqB5ZKDJVO6g1p9jn__z6XG9szep8puYMqIr4mcFdK9X-fA");
				request.setRequestHeader("Authorization","Bearer "+self.accessToken);
			},
		}).done(function(data) {
			console.log(data)
		},"json");
	}
	
	this.getUserBlogDetails = function(){
		var url = "https://www.googleapis.com/blogger/v3/users/self/blogs";
		self = this;
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			beforeSend: function (request)
			{
				//request.setRequestHeader("Authorization","Bearer ya29.1.AADtN_VXVsrqd4u-ccW2wMOZqB5ZKDJVO6g1p9jn__z6XG9szep8puYMqIr4mcFdK9X-fA");
				request.setRequestHeader("Authorization","Bearer "+self.accessToken);
			},
		}).done(function(data) {
			obj = data;
			console.log("yaha aaya");
			console.log(obj);
			console.log("yaha gaya");

			for(var i=0;i<obj["items"].length;++i){
				temp = {};
				temp["name"] = obj["items"][i].name;
				temp["id"] = obj["items"][i].id;
				self.blogDetails.push(temp);
			}
		},"json");
	}
	
	this.init = function(){
		console.log("yaha bhi aaya ");
		this.getAccessToken();
		this.verifyAccessToken();
		console.log(this.error);
		if(this.error == null){
			console.log("going Great");
			this.getUserDetail();
			this.getUserBlogDetails();
			this.loadJourney();
			this.postJourney();
		}else{
			console.log(this.error);
			
		}
	};
}

$(document).ready(function() {
	newUser = new newBlogDetails("ahNkZXZ-dGhldHJhdmVsZXJib29rchQLEgdKb3VybmV5GICAgICA0PsIDA");
	newUser.init();
});