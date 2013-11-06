from google.appengine.ext import db

class Journey(db.Model):
    
    name = db.StringProperty()
    description = db.StringProperty()
    image = db.StringProperty()
    
    user_id = db.StringProperty(required=True)
    
    