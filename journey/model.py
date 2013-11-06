from google.appengine.ext import db

class Journey(db.Model):
    
    id = db.IntegerProperty()
    
    name = db.StringProperty()
    description = db.StringProperty()
    image = db.StringProperty()
    
    user_id = db.IntegerProperty(required=True)
    
    