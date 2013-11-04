from auth_handlers import BaseRequestHandler

class LandingPage(BaseRequestHandler):

    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        if self.logged_in == True:
            self.response.write({'user':self.current_user})
        else:
            self.response.write({'user':None})