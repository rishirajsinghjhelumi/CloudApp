from google.appengine.ext import db

class Location(db.Model):

    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    location = db.StringProperty()
    time = db.DateTimeProperty(auto_now_add=False)