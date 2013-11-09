from google.appengine.ext import db

from util import getTimeEpoch

from auth_handlers import BaseRequestHandler
from image_handler import PostImage,Image
from milestone.model import Milestone,MilestoneAttachment

import json

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
        
        self.response.write(json.dumps({'milestone_id' : str(newMilestone.key())}))
        
def deleteMilestone(milestone):
    
    if milestone.image != None:
        image = Image.get(milestone.image)
        if image != None:
            Image.delete(image)
            
    query = db.Query(MilestoneAttachment)
    query.filter('milestone_id = ',str(milestone.key()))
    for attachment in query.run():
        deleteAttachment(attachment)
    
    if milestone != None:
        Milestone.delete(milestone)

class MilestoneDelete(BaseRequestHandler):
    
    def get(self,milestone_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        milestone = Milestone.get(milestone_id)
        if milestone == None:
            self.response.write({'status' : 0})
            return
        
        deleteMilestone(milestone)
        
        self.response.write(json.dumps({'status' : 1}))

class MilestoneGet(BaseRequestHandler):
    
    def get(self,milestone_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        milestone = Milestone.get(milestone_id)
        
        if milestone == None:
            self.response.write({'milestone' : None})
            return
        
        milestoneInfo = dict(milestone.__dict__['_entity'])
        milestoneInfo['milestone_id'] = milestone_id
        
        query = db.Query(MilestoneAttachment)
        query.filter('milestone_id = ',milestone_id)
        query.order('time')
        
        attachments = []
        for attachment in query.run():
            attachmentInfo = dict(attachment.__dict__['_entity'])
            attachmentInfo['attachment_id'] = str(attachment.key())
            attachments.append(attachmentInfo)
            
        milestoneInfo['attachments'] = attachments
        
        self.response.write(json.dumps({'milestone' : milestoneInfo}))


class MilestoneAttachmentAdd(BaseRequestHandler):
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        newAttachment = MilestoneAttachment(milestone_id = self.request.get('milestone_id'))
        newAttachment.description = self.request.get('description')
        newAttachment.image = PostImage(self.request.POST.multi['image'])
        newAttachment.time = getTimeEpoch()
        
        newAttachment.put()
        
        self.response.write(json.dumps({'attachment_id' : str(newAttachment.key())}))
        
def deleteAttachment(attachment):
    
    if attachment.image != None:
        image = Image.get(attachment.image)
        if image != None:
            Image.delete(image)
    
    if attachment != None:
        MilestoneAttachment.delete(attachment)

class MilestoneAttachmentDelete(BaseRequestHandler):
    
    def get(self,attachment_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        attachment = MilestoneAttachment.get(attachment_id)
        
        if attachment == None:
            self.response.write({'status' : 0})
            return
        
        deleteAttachment(attachment)
        
        self.response.write(json.dumps({'status' : 1}))
        