from google.appengine.ext import db

class Milestone(db.Model):
    
    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    location = db.StringProperty()
    time = db.IntegerProperty()
    
    description = db.StringProperty()
    image = db.StringProperty()
    
    journey_id = db.StringProperty(required=True)
    

class MilestoneAttachment(db.Model):
    
    type = db.StringProperty(choices=set(["text", "image", "video"]))
    url = db.StringProperty(required=True)
    
    milestone_id = db.StringProperty(required=True)
    
    