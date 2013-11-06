import webapp2

from google.appengine.ext import db

from util import getTimeEpoch

from journey.model import Journey
from auth_handlers import BaseRequestHandler
from image_handler import PostImage,Image
from milestone.model import Milestone,MilestoneAttachment

class Try(BaseRequestHandler):
    
    def get(self):
        
        self.response.out.write('<html><body>')
        self.response.out.write("""
              <form action="/milestone/new" enctype="multipart/form-data" method="post">
                <div><input type="text" name="latitude" rows="3" cols="60"/></div>
                <div><input type="text" name="longitude" rows="3" cols="60"/></div>
                <div><input type="text" name="location" rows="3" cols="60"/></div>
                <div><input type="text" name="journey_id" rows="3" cols="60"/></div>
                <div><input type="submit" value="Create New"></div>
              </form>
              <hr>
            </body>
          </html>""" )
        
class MilestoneNew(BaseRequestHandler):
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        newMilestone = Milestone(journey_id = self.request.get('journey_id'))
        
        newMilestone.latitude = float(self.request.get('latitude'))
        newMilestone.longitude = float(self.request.get('longitude'))
        newMilestone.location = self.request.get('location')
        newMilestone.time = getTimeEpoch()
        
        newMilestone.put()
        
        self.response.write({'milestone_id' : str(newMilestone.key())})
        
def deleteMilestone(milestone):
    
    if milestone.image != None:
        image = Image.get(milestone.image)
        if image != None:
            Image.delete(image)
    
    if milestone != None:
        Milestone.delete(milestone)

class MilestoneDelete(BaseRequestHandler):
    
    #TODO delete milestone attachments
    def get(self,milestone_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        milestone = Milestone.get(milestone_id)
        if milestone == None:
            self.response.write({'status' : 0})
            return
        
        deleteMilestone(milestone)
        
        self.response.write({'status' : 1})
        