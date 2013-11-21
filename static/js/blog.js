var newUser;

var newBlogDetails = function(journeyId){
	this.accessToken = null;
	this.journeyId = journeyId;
	this.journeyDetails = null;
	this.journeyMilestones = null;
	this.error = null;
	this.blogDetails = [];
	
	this.verifyAccessToken = function(){
		self = this;
		var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + this.accessToken;
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			error: function(data) {
				self.error = data['responseJSON']['error'];
			},
		}).done(function(data) {
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
			console.log(data['access_token']);
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
	
	this.getImageSource = function(imageId){
		
		var baseUrl = "http://thetravelerbook.appspot.com";
		var imgSource = baseUrl + "/image/" + imageId;
		return imgSource;
		
	}
	
	this.getGeneratedBlog = function(blogId){
		
		var blog = {};
		blog['kind'] = "blogger#post";
		blog['blog'] = {};
		blog['blog']['id'] = blogId;
		blog['title'] = this.journeyDetails["name"];
		
		var content = "";
		
		content += '<h2>' + this.journeyDetails['name'] + '</h2>';
		
		var journeyTime = new Date(this.journeyDetails['time'] * 1000);
		content += '<h5>' + journeyTime.toDateString() + '</h5>';
		
		content += '<p>' + this.journeyDetails['description'] + '</p>';
		content += '<img src = "' + this.getImageSource(this.journeyDetails['image']) + '" />';
		
		for(i=0;i<this.journeyDetails['path'];i++){
			var milestoneContent = "";
			
			content += milestoneContent;
		}
		
		blog['content'] = content;
		return blog;
		
	}

	this.postJourney = function(){
		
		self = this;
		var currBlog = this.blogDetails[0];
		var journeyDate = new Date( this.journeyDetails['time'] * 1000);
		var url = "https://www.googleapis.com/blogger/v3/blogs/" + currBlog["id"] + "/posts/";
		
		var blogToPost = JSON.stringify(this.getGeneratedBlog(currBlog['id']));
		console.log(blogToPost);
		
		$.ajax({
			url: url,
			async:false,
			type: 'POST',
			data: blogToPost,
			beforeSend: function (request)
			{
				request.setRequestHeader("Authorization","Bearer " + self.accessToken);
				request.setRequestHeader("Content-Type","application/json");
			},
		}).done(function(data) {
			console.log(data);
		});
		
	}
	
	this.getUserDetail = function(){
		
		var url = "https://www.googleapis.com/blogger/v3/users/self";
		self = this;
		$.ajax({
			url: url,
			type: 'GET',
			async:false,
			beforeSend: function (request)
			{
				request.setRequestHeader("Authorization","Bearer " + self.accessToken);
			},
		}).done(function(data) {
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
				request.setRequestHeader("Authorization","Bearer " + self.accessToken);
			},
		}).done(function(data) {
			for(var i=0;i<data["items"].length;++i){
				self.blogDetails.push(data["items"][i]);
			}
		},"json");
	}
	
	this.init = function(){
		this.getAccessToken();
		this.verifyAccessToken();
		
		if(this.error == null){
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