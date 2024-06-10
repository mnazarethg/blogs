const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

describe('PUT /api/blogs/:id', () => {
  test('successfully updates the number of likes for a blog post', async () => {
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    });

    const savedBlog = await newBlog.save();
    const updatedLikes = { likes: 10 };

    await api
      .put(`/api/blogs/${savedBlog._id}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get(`/api/blogs/${savedBlog._id}`);
  });
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 0
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const titles = response.body.map(r => r.title);

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  assert(titles.includes('New Blog'));
});

test('blog without likes is added with 0 likes', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Test Author',
    url: 'http://testurl.com'
  };

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/);

const blogsAfterPost = await api.get('/api/blogs');
const addedBlog = blogsAfterPost.body.find(blog => blog.title === 'Blog Without Likes');
assert.strictEqual(addedBlog.likes, 0);
});

test('blog without title or url is not added and returns status 400', async () => {
  const newBlogWithoutTitle = {
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 1
  };

  const newBlogWithoutUrl = {
    title: 'Missing URL',
    author: 'Test Author',
    likes: 2
  };

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400);

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400);
});

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs');
  const blogToDelete = blogsAtStart.body[0];

  await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

  const blogsAtEnd = await api.get('/api/blogs');
  const titles = blogsAtEnd.body.map(r => r.title);

  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1);
  assert(!titles.includes(blogToDelete.title));
});

after(async () => {
  await mongoose.connection.close()
})