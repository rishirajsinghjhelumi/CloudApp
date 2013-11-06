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
    
    description = db.StringProperty()
    image = db.StringProperty()
    
    milestone_id = db.StringProperty(required=True)
    
    