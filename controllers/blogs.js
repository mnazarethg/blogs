const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog    
    .find({}).populate('user', { username: 1, name: 1 })
    
  response.json(blogs)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  console.log("el usuario obtenido en post" + user)
  
  const blog = new Blog({
    title: body.title,
    author: user.username,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  console.log("saved blog" + savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (user.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'token not permition' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
  
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
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter