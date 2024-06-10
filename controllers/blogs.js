const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
const { title, url } = request.body;

if (!title || !url) {
  return response.status(400).json({ error: 'Title and URL are required' });
}
const blog = new Blog(request.body)

try {
  const savedBlog = blog.save();
  response.status(201).json(savedBlog);
} catch (error) {
  response.status(400).json({ error: error.message });
}
});

blogsRouter.delete('/:id', async (request, response) => {
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

module.exports = blogsRouter