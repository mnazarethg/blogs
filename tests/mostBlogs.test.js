const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blog', () => {
	const listMostBlogs = [
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

const counts = {};
let maxBlogs = 0;
let authorWithMostBlogs = null;

listMostBlogs.forEach(blog => {
	counts[blog.author] = (counts[blog.author] || 0) + 1;
	if (counts[blog.author] > maxBlogs) {
		maxBlogs = counts[blog.author];
		authorWithMostBlogs = blog.author;
	}
});

test('author with the most blogs', () => {
	const result = listHelper.mostBlogs(listMostBlogs)
	const expected = {
		author: authorWithMostBlogs,
		blogs: maxBlogs
	};
	assert.deepStrictEqual(result, expected)
	console.log(expected)
})
})