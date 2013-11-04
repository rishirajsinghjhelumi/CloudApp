from google.appengine.ext import db
from ..models import Location

class Journey(db.Model,Location):
    
    id = db.IntegerProperty(required=True)
    
    start_location = Location()
    stop_location = Location()
    
    name = db.StringProperty()
    description = db.StringProperty()
    image = db.StringProperty()
    
    user_id = db.IntegerProperty(required=True)
    
    