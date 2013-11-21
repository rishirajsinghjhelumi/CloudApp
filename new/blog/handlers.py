from milestone.model import Milestone,MilestoneAttachment
from milestone.handlers import deleteMilestone
from journey.model import Journey


class GetJourneyDetails(BaseRequestHandler):
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        newBlogDetails = str(self.current_user.key.auth_info.access_token())
        print newJourney
        return 
        newJourney.name = self.request.get('name')
        newJourney.description = self.request.get('description')
        newJourney.image = PostImage(self.request.POST.multi['image'])
        newJourney.time = getTimeEpoch()
        
        newJourney.put()
        
        self.response.write(json.dumps({'journey_id' : str(newJourney.key())}))



