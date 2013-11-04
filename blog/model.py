from google.appengine.ext import db

class Blog(db.Model):
    
    id = db.IntegerProperty(required=True)
    
    blog_id = db.StringProperty()
    blog_url = db.StringProperty()
    
    user_id = db.IntegerProperty(required=True)
    journey_id = db.IntegerProperty(required=True)