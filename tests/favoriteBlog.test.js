const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
	const listBlogs = [
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
		}
	]

const maxLikes = Math.max(...listBlogs.map(blog => blog.likes));
const favorite = listBlogs.find(blog => blog.likes === maxLikes);

test('the highest number of likes from the list of blogs', () => {
	const result = listHelper.favoriteBlog(listBlogs)
	assert.deepStrictEqual(result, favorite)
	console.log(favorite)
})
})