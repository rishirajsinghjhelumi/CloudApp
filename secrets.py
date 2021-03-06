# Copy this file into secrets.py and set keys, secrets and scopes.

# This is a session secret key used by webapp2 framework.
# Get 'a random and long string' from here: 
# http://clsc.net/tools/random-string-generator.php
# or execute this from a python shell: import os; os.urandom(64)
SESSION_KEY = "ThIsIsVerySTUpId"

# Google APIs
GOOGLE_APP_ID = '211096637650-9bjjsv0npb491ugtg93trno3hmmu8pof.apps.googleusercontent.com'
GOOGLE_APP_SECRET = 'P378SE-kI5qblDb4dAVsOFlk'
GOOGLE_APP_KEY = 'AIzaSyBoJsQ8A7od6F-9dFROYGWZRwS8Hex0VmY'

#GOOGLE_APP_ID = '211096637650-lpvumq2suu8426mj3vdudcghefdb8gu6.apps.googleusercontent.com'
#GOOGLE_APP_SECRET = 'e76rya2b8LvoBQZRzqxO0aes'

# Facebook auth apis
FACEBOOK_APP_ID = '536756159749180'
FACEBOOK_APP_SECRET = 'c44d187fd1e805165968322e8f83cb82'

# Key/secret for both LinkedIn OAuth 1.0a and OAuth 2.0
# https://www.linkedin.com/secure/developer
LINKEDIN_KEY = 'consumer key'
LINKEDIN_SECRET = 'consumer secret'

# https://manage.dev.live.com/AddApplication.aspx
# https://manage.dev.live.com/Applications/Index
WL_CLIENT_ID = 'client id'
WL_CLIENT_SECRET = 'client secret'

# https://dev.twitter.com/apps
TWITTER_CONSUMER_KEY = 'BgoCJvEe2zEyUTKyzKA'
TWITTER_CONSUMER_SECRET = 'Up7nZXYcyk1cb48HP5dgqrEcffDSz2wTvA39OurS5Q'

# https://foursquare.com/developers/apps
FOURSQUARE_CLIENT_ID = 'client id'
FOURSQUARE_CLIENT_SECRET = 'client secret'

# config that summarizes the above
AUTH_CONFIG = {
  # OAuth 2.0 providers
  'google'      : (GOOGLE_APP_ID, GOOGLE_APP_SECRET,
                  'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/blogger'),
  'linkedin2'   : (LINKEDIN_KEY, LINKEDIN_SECRET,
                  'r_basicprofile'),
  'facebook'    : (FACEBOOK_APP_ID, FACEBOOK_APP_SECRET,
                  'user_about_me'),
  'windows_live': (WL_CLIENT_ID, WL_CLIENT_SECRET,
                  'wl.signin'),
  'foursquare'  : (FOURSQUARE_CLIENT_ID,FOURSQUARE_CLIENT_SECRET,
                  'authorization_code'),

  # OAuth 1.0 providers don't have scopes
  'twitter'     : (TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET),
  'linkedin'    : (LINKEDIN_KEY, LINKEDIN_SECRET),

  # OpenID doesn't need any key/secret
}
