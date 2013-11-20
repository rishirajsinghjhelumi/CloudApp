import webapp2
import sys
from webapp2 import Route

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
            Route('/', handler = 'handlers.LandingPage'),
            Route('/about', handler = 'handlers.AboutPage'),
            Route('/team', handler = 'handlers.TeamPage'),
            
            
            Route('/logout', handler='auth_handlers.AuthHandler:logout', name='logout'),
            Route('/auth/<provider>', handler='auth_handlers.AuthHandler:_simple_auth', name='auth_login'),
            Route('/auth/<provider>/callback', handler='auth_handlers.AuthHandler:_auth_callback', name='auth_callback'),
            Route('/profile', handler='auth_handlers.ProfileHandler', name='profile'),
            
            Route('/image/<image_id>', handler='image_handler.GetImage', name='getImage'),
            
            Route('/journey/try', handler='journey.handlers.Try', name='Try'),
            Route('/journey/new', handler='journey.handlers.JourneyNew', name='newJourney'),
            Route('/journey/delete/<journey_id>', handler='journey.handlers.JourneyDelete', name='deleteJourney'),
            Route('/journey/get/<journey_id>', handler='journey.handlers.JourneyGet', name='getJourney'),
            Route('/journey/getall', handler='journey.handlers.JourneyGetAll', name='getAllJourney'),
            
            Route('/milestone/try', handler='milestone.handlers.Try', name='Try'),
            Route('/milestone/new', handler='milestone.handlers.MilestoneNew', name='newMilestone'),
            Route('/milestone/delete/<milestone_id>', handler='milestone.handlers.MilestoneDelete', name='deleteMilestone'),
            Route('/milestone/get/<milestone_id>', handler='milestone.handlers.MilestoneGet', name='getMilestone'),
            
            Route('/attachment/new', handler='milestone.handlers.MilestoneAttachmentAdd', name='addAttachment'),
            Route('/attachment/delete/<attachment_id>', handler='milestone.handlers.MilestoneAttachmentDelete', name='deleteAttachment'),
            Route('/attachment/get/<attachment_id>', handler='milestone.handlers.MilestoneAttachmentGet', name='getAttachment'),
            
        ]

application = webapp2.WSGIApplication(paths , config=app_config ,debug=True)
