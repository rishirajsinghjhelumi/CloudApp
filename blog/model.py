from google.appengine.ext import db

class Blog(db.Model):
    
    blog_id = db.StringProperty()
    blog_url = db.StringProperty()
    
    user_id = db.StringProperty(required=True)
    journey_id = db.StringProperty(required=True)