from auth_handlers import BaseRequestHandler
from google.appengine.ext.webapp import template
import os

class LandingPage(BaseRequestHandler):

    def get(self):
        
        if self.logged_in == True:
            #self.response.write({'user':self.current_user}
            self.render('map.html') 
        else:
            self.response.write({'user':None})
