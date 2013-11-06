import webapp2
import sys
from webapp2 import Route
from google.appengine.ext import db

from secrets import SESSION_KEY

if 'lib' not in sys.path:
    sys.path[0:0] = ['lib']
      
app_config = {
  'webapp2_extras.sessions': {
    'cookie_name': '_simpleauth_sess',
    'secret_key': SESSION_KEY
  },
  'webapp2_extras.auth': {
    'user_attributes': []
  }
}
            
paths = [
            Route(r'/', handler = 'handlers.LandingPage'),
            Route(r'/home/<year>/<month>',handler = 'journey.handlers.HomePage'),
            Route('/logout', handler='auth_handlers.AuthHandler:logout', name='logout'),
            Route('/auth/<provider>', handler='auth_handlers.AuthHandler:_simple_auth', name='auth_login'),
            Route('/auth/<provider>/callback', handler='auth_handlers.AuthHandler:_auth_callback', name='auth_callback'),
            Route('/profile', handler='auth_handlers.ProfileHandler', name='profile'),
            Route('/img/<image_id>', handler='image_handler.GetImage', name='getImg'),
        ]

application = webapp2.WSGIApplication(paths , config=app_config ,debug=True)
