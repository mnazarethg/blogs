const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog    
    .find({}).populate('user', { username: 1, name: 1 })
    
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    tittle: body.tittle,
    author: body.author || false,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  try {
    console.log('Deleting blog with ID:', request.params.id);
    const result = await Blog.findByIdAndDelete(request.params.id);
    if (!result) {
      console.log('No blog found with that ID');
      return response.status(404).json({ error: 'Blog not found' });
    }
    console.log('Blog deleted successfully');
    response.status(204).send();
  } catch (error) {
    console.log('Error during deletion:', error);
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true });
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === userid.toString()) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter