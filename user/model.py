from google.appengine.ext import db

class User(db.Model):
    
    id = db.IntegerProperty()
    given_name = db.StringProperty()
    formatted = db.StringProperty()
    family_name = db.StringProperty()
    email = db.StringProperty(required=True,unique=True)
    user_id = db.IntegerProperty()
    access_token = db.StringProperty()
    refresh_token = db.StringProperty()
    profile_pic = db.StringProperty()