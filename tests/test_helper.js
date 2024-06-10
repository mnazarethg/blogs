const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
      {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f6',
    title: 'Other blog',
    author: "Robert C. Martin",
    likes: 17
  }	
]

module.exports = {
  initialBlogs
}