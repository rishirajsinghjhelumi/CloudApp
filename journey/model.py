from google.appengine.ext import db

class Journey(db.Model):
    
    id = db.StringProperty()
    
    name = db.StringProperty()
    description = db.StringProperty()
    image = db.StringProperty()
    
    user_id = db.StringProperty(required=True)
    
    