from google.appengine.ext import db

class Blog(db.Model):
    
    blog_id = db.StringProperty()
    blog_url = db.StringProperty()
    blog_link = db.StringProperty()
    blog_content = db.TextProperty()
    post_time = db.IntegerProperty()
    
    user_id = db.StringProperty(required=True)
    journey_id = db.StringProperty(required=True)
