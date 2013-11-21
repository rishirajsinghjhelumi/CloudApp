from auth_handlers import BaseRequestHandler
import json

class LandingPage(BaseRequestHandler):

    def get(self):
        if self.logged_in == True:
            self.render('map.html') 
        else:
            self.render('home.html')
            
class AboutPage(BaseRequestHandler):
    
    def get(self):
        self.render('About.html')
    
class TeamPage(BaseRequestHandler):
    
    def get(self):
        self.render('team.html')
        
class HelpPage(BaseRequestHandler):
    
    def get(self):
        self.render('help.html')
        
class TechnologyPage(BaseRequestHandler):
    
    def get(self):
        self.render('technology.html')
        
class BlogPage(BaseRequestHandler):

    def get(self):
        self.render('blog.html')
        
class ComingSoonPage(BaseRequestHandler):

    def get(self):
        self.render('comingsoon.html')

class GetAccessToken(BaseRequestHandler):
    def get(self):
        
        if self.logged_in == True:
            self.response.headers['Content-Type'] = 'application/json'
            userAccessToken = str(self.session['user_auth_info']['access_token'])
            self.response.write(json.dumps({'access_token' :userAccessToken }))
        else:
            self.response.write(json.dumps({'access_token' :"0" }))
    
    