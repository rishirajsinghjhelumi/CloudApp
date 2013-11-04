import webapp2

from handlers import LandingPage
from journey.handlers import HomePage


from google.appengine.api import users

class MyHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            greeting = ('Welcome, %s! (<a href="%s">sign out</a>)' %
                        (user.nickname(), users.create_logout_url('/')))
        else:
            greeting = ('<a href="%s">Sign in or register</a>.' %
                        users.create_login_url('/'))

        self.response.out.write('<html><body>%s</body></html>' % greeting)
        

paths = [
            webapp2.Route(r'/', handler = LandingPage),
            webapp2.Route(r'/home/<year>/<month>',handler = HomePage),
            webapp2.Route(r'/test', handler = MyHandler),
        ]

application = webapp2.WSGIApplication(paths , debug=True)
