import webapp2

from google.appengine.ext import db
from google.appengine.api import images

class Image(db.Model):
    
    name = db.StringProperty()
    image = db.BlobProperty(default=None)
    
    
class GetImage(webapp2.RequestHandler):
    
    def get(self,image_id):
        image = db.get(image_id)
        if image.image:
            
            #img = images.Image(image.image)
            #img.im_feeling_lucky()
            #img = img.execute_transforms(output_encoding=images.JPEG)
            
            self.response.headers['Content-Type'] = 'image/jpeg'
            self.response.out.write(image.image)
        else:
            self.response.out.write('No image')
            
def PostImage(image):
    
    newImage = Image()
    newImage.image = db.Blob(image.file.read())
    newImage.name = image.filename
    
    newImage.put()
    
    return str(newImage.key())
    
    
    