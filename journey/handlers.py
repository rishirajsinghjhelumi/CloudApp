import webapp2

class HomePage(webapp2.RequestHandler):

    def get(self,month,year):
        self.response.headers['Content-Type'] = 'application/json'
        
        obj = {
               'success': year, 
               'payload': month,
            } 
        self.response.write(obj)
