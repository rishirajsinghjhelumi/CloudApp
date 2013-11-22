import json
from google.appengine.ext import db

from util import getTimeEpoch
from auth_handlers import BaseRequestHandler
from blog.model import Blog


class BlogNew(BaseRequestHandler):
    
    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        
        userId = str(self.current_user.key.id())
        
        newBlog = Blog(user_id = userId,journey_id = self.request.get('journey_id'))
        newBlog.blog_id = self.request.get('blog_id')
        newBlog.blog_link = self.request.get('blog_link')
        newBlog.blog_url = self.request.get('blog_url')
        newBlog.blog_content = self.request.get('blog_content')
        newBlog.post_time = getTimeEpoch()
        
        newBlog.put()
        
        self.response.write(json.dumps({'blog_id' : str(newBlog.key())}))
        
class BlogGetAll(BaseRequestHandler):
    
    def get(self,journey_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        query = db.Query(Blog)
        query.filter('journey_id = ',journey_id)
        query.order('time')
        
        blogs = []
        for blog in query.run():
            blogInfo = dict(blog.__dict__['_entity'])
            blogInfo['id'] = str(blog.key())
            
            blogs.append(blogInfo)
            
        self.response.write(json.dumps({'blogs' : blogs}))
        
class BlogGet(BaseRequestHandler):
    
    def get(self,blog_id):
        self.response.headers['Content-Type'] = 'application/json'
        
        blog = Blog.get(blog_id)
        blogInfo = dict(blog.__dict__['_entity'])
        blogInfo['id'] = str(blog.key())
        
        self.response.write(json.dumps({'blog' : blogInfo}))
        
            