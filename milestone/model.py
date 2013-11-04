from google.appengine.ext import db
from ..models import Location

class Milestone(db.Model,Location):
    
    id = db.IntegerProperty(required=True)
    
    location = Location()
    
    description = db.StringProperty()
    image = db.StringProperty()
    
    journey_id = db.IntegerProperty(required=True)
    

class MilestoneAttachment(db.Model,Location):
    
    id = db.IntegerProperty(required=True)
    
    type = db.StringProperty(choices=set(["text", "image", "video"]))
    url = db.StringProperty(required=True)
    
    milestone_id = db.IntegerProperty(required=True)
    
    