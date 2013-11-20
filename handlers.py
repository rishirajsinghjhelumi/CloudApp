from auth_handlers import BaseRequestHandler

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
    
    