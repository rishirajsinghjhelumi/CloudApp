import webapp2

from google.appengine.ext import db

from util import getTimeEpoch

from journey.model import Journey
from auth_handlers import BaseRequestHandler
from image_handler import PostImage,Image
from milestone.model import Milestone,MilestoneAttachment
from milestone.handlers import deleteMilestone

import json

class Try(webapp2.RequestHandler):
    
    def get(self):
        
        self.response.out.write('<html><body>')
        self.response.out.write("""
              <form action="/journey/new" enctype="multipart/form-data" method="post">
                <div><textarea name="name" rows="3" cols="60"></textarea></div>
                <div><textarea name="description" rows="3" cols="60"></textarea></div>
                <div><label>Avatar:</label></div>
                <div><input type="file" name="image"/></div>
                <div><input type="submit" value="Create New"></div>
              </form>
              <hr>
            </body>
          </html>""" )
        

class JourneyNew(BaseRequestHandler):
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        newJourney = Journey(user_id = str(self.current_user.key.id()))
        
        newJourney.name = self.request.get('name')
        newJourney.description = self.request.get('description')
        newJourney.image = PostImage(self.request.POST.multi['image'])
        newJourney.time = getTimeEpoch()
        
        newJourney.put()
        
        self.response.write(json.dumps({'journey_id' : str(newJourney.key())}))
        
def deleteJourney(journey):
    
    if journey.image != None:
        image = Image.get(journey.image)
        if image != None:
            Image.delete(image)
        
    query = db.Query(Milestone)
    query.filter('journey_id = ',str(journey.key()))
    for milestone in query.run():
        deleteMilestone(milestone)
    
    if journey != None:
        Journey.delete(journey)
        
class JourneyDelete(BaseRequestHandler):
    
    def get(self,journey_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        journey = Journey.get(journey_id)
        if journey == None:
            self.response.write({'status' : 0})
            return
         
        deleteJourney(journey)
        
        self.response.write(json.dumps({'status' : 1}))
        
class JourneyGet(BaseRequestHandler):
    
    def get(self,journey_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        journey = Journey.get(journey_id)
        
        if journey == None:
            self.response.write({'journey' : None})
            return
        
        journeyInfo = dict(journey.__dict__['_entity'])
        journeyInfo['journey_id'] = journey_id
        
        query = db.Query(Milestone)
        query.filter('journey_id = ',journey_id)
        query.order('time')
        
        milestones = []
        for milestone in query.run():
            milestoneInfo = dict(milestone.__dict__['_entity'])
            milestoneInfo['milestone_id'] = str(milestone.key())
            
            query1 = db.Query(MilestoneAttachment)
            query1.filter('milestone_id = ',str(milestone.key()))
            query1.order('time')
            
            attachments = []
            for attachment in query1.run():
                attachmentInfo = dict(attachment.__dict__['_entity'])
                attachmentInfo['attachment_id'] = str(attachment.key())
                attachments.append(attachmentInfo)
            
            milestoneInfo['attachments'] = attachments
                
            milestones.append(milestoneInfo)
        
        journeyInfo['path'] = milestones
        
        self.response.write(json.dumps({'journey' : journeyInfo}))

class JourneyGetAll(BaseRequestHandler):
    
    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        user_id = str(self.current_user.key.id())
        
        query = db.Query(Journey)
        query.filter('user_id = ',user_id)
        query.order('-time')
        
        journeys = []
        for journey in query.run():
            journeyInfo = dict(journey.__dict__['_entity'])
            journeyInfo['journey_id'] = str(journey.key()) 
            journeys.append(journeyInfo)
            
        self.response.write(json.dumps({'journeys' : journeys}))
