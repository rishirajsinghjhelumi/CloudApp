from google.appengine.api import users
import webapp2

class LandingPage(webapp2.RequestHandler):

    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        user = users.get_current_user()
            
        self.response.write({'user':user,'auth' : 's'})