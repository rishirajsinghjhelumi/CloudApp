from google.appengine.ext import db

class Milestone(db.Model):
    
    id = db.IntegerProperty()
    
    latitude = db.FloatProperty()
    longitude = db.FloatProperty()
    location = db.StringProperty()
    time = db.IntegerProperty()
    
    description = db.StringProperty()
    image = db.StringProperty()
    
    journey_id = db.IntegerProperty(required=True)
    

class MilestoneAttachment(db.Model):
    
    id = db.IntegerProperty()
    
    type = db.StringProperty(choices=set(["text", "image", "video"]))
    url = db.StringProperty(required=True)
    
    milestone_id = db.IntegerProperty(required=True)
    
    