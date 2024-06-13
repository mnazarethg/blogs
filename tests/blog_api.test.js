const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

let token;

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' });

  token = response.body.token;
  });

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
      .set('Authorization', `Bearer ${token}`)
      .send(updatedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get(`/api/blogs/${savedBlog._id}`);
  });
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400);

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})